import sys
import os
import xml.etree.ElementTree as ET

PATH_BACKEND = './backend/coverage.xml'
PATH_FRONTEND = './frontend/coverage/cobertura-coverage.xml'

class CobeturaXML:
    def __init__(self, path):
        self.tree = ET.parse(path)
        self.root = self.tree.getroot()
        self.source = self.root[0]
        self.package = self.root[1]

    def upstream(self):
        basename = os.path.basename(self.source[0].text)
        self.source_upstream()
        self.package_upstream(self.package, basename)
    
    def source_upstream(self):
        self.source[0].text = os.path.dirname(self.source[0].text)

    def package_upstream(self, node, basename):
        if 'filename' in node.attrib:
            node.attrib['filename'] = basename + '/' + node.attrib['filename']
        for child in node:
            self.package_upstream(child, basename)
    
    def merge(self, other):
        if self is other:
            raise ValueError('Cannot merge same file!')
        if self.source[0].text != other.source[0].text:
            raise ValueError('Merging file must have same root!')
        
        lines_valid = int(self.root.attrib['lines-valid']) + int(other.root.attrib['lines-valid'])
        lines_covered = int(self.root.attrib['lines-covered']) + int(other.root.attrib['lines-covered'])
        branches_valid = int(self.root.attrib['branches-valid']) + int(other.root.attrib['branches-valid'])
        branches_covered = int(self.root.attrib['branches-covered']) + int(other.root.attrib['branches-covered'])
        self.root.attrib['lines-valid'] = str(lines_valid)
        self.root.attrib['lines-covered'] = str(lines_covered)
        self.root.attrib['branches-valid'] = str(branches_valid)
        self.root.attrib['branches-covered'] = str(branches_covered)
        self.root.attrib['line-rate'] = str(lines_covered / lines_valid)
        self.root.attrib['branch-rate'] = str(branches_covered / branches_valid)

        for package in other.package:
            self.package.append(package)

    def save(self, path):
        self.tree.write(path, encoding='utf-8', xml_declaration=True)
    
    def translate_generic(self):
        root = ET.Element('coverage')
        root.attrib['version'] = '1'
        self.translate_generic_file(self.package, root)
        return ET.ElementTree(root)

    def translate_generic_file(self, node, coverage):
        if 'filename' in node.attrib:
            file = ET.Element('file')
            file.attrib['path'] = node.attrib['filename']
            coverage.append(file)
            for child in node:
                self.translate_generic_line(child, file)
        else:
            for child in node:
                self.translate_generic_file(child, coverage)
    
    def translate_generic_line(self, node, file):
        if node.tag == 'line':
            line = ET.Element('lineToCover')
            line.attrib['lineNumber'] = node.attrib['number']
            if node.attrib['hits'] == '0':
                line.attrib['covered'] = 'false'
            else:
                line.attrib['covered'] = 'true'
            file.append(line)
        else:
            for child in node:
                self.translate_generic_line(child, file)

if __name__ == '__main__':
    xml_frontend = CobeturaXML(PATH_FRONTEND)
    xml_backend = CobeturaXML(PATH_BACKEND)
    xml_frontend.upstream()
    xml_backend.upstream()
    xml_frontend.merge(xml_backend)
    tree = xml_frontend.translate_generic()
    tree.write('coverage.xml', encoding='utf-8')
    #xml_frontend.save('coverage.xml')