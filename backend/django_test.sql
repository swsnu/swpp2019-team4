--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: assaapp_building; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_building (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    latitude numeric(16,8) NOT NULL,
    longitude numeric(16,8) NOT NULL,
    repre_name character varying(16) NOT NULL
);


ALTER TABLE public.assaapp_building OWNER TO root;

--
-- Name: assaapp_building_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_building_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_building_id_seq OWNER TO root;

--
-- Name: assaapp_building_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_building_id_seq OWNED BY public.assaapp_building.id;


--
-- Name: assaapp_course; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_course (
    id integer NOT NULL,
    semester character varying(8) NOT NULL,
    classification character varying(8) NOT NULL,
    college character varying(32) NOT NULL,
    department character varying(128) NOT NULL,
    degree_program character varying(32) NOT NULL,
    academic_year character varying(8) NOT NULL,
    course_number character varying(16) NOT NULL,
    lecture_number character varying(8) NOT NULL,
    title character varying(128) NOT NULL,
    subtitle character varying(128) NOT NULL,
    credit integer NOT NULL,
    lecture_credit integer NOT NULL,
    lab_credit integer NOT NULL,
    lecture_type character varying(64) NOT NULL,
    "time" character varying(128) NOT NULL,
    location character varying(128) NOT NULL,
    professor character varying(64) NOT NULL,
    quota character varying(16) NOT NULL,
    remark text NOT NULL,
    language character varying(16) NOT NULL,
    status character varying(8) NOT NULL
);


ALTER TABLE public.assaapp_course OWNER TO root;

--
-- Name: assaapp_course_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_course_id_seq OWNER TO root;

--
-- Name: assaapp_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_course_id_seq OWNED BY public.assaapp_course.id;


--
-- Name: assaapp_coursetime; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_coursetime (
    id integer NOT NULL,
    lectureroom character varying(8) NOT NULL,
    weekday integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    building_id integer NOT NULL,
    course_id integer NOT NULL
);


ALTER TABLE public.assaapp_coursetime OWNER TO root;

--
-- Name: assaapp_coursetime_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_coursetime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_coursetime_id_seq OWNER TO root;

--
-- Name: assaapp_coursetime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_coursetime_id_seq OWNED BY public.assaapp_coursetime.id;


--
-- Name: assaapp_customcourse; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_customcourse (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    color character varying(8) NOT NULL,
    course_id integer,
    timetable_id integer NOT NULL
);


ALTER TABLE public.assaapp_customcourse OWNER TO root;

--
-- Name: assaapp_customcourse_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_customcourse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_customcourse_id_seq OWNER TO root;

--
-- Name: assaapp_customcourse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_customcourse_id_seq OWNED BY public.assaapp_customcourse.id;


--
-- Name: assaapp_customcoursetime; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_customcoursetime (
    id integer NOT NULL,
    lectureroom character varying(8) NOT NULL,
    weekday integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    building_id integer NOT NULL,
    course_id integer NOT NULL,
    timetable_id integer NOT NULL,
    detail text NOT NULL
);


ALTER TABLE public.assaapp_customcoursetime OWNER TO root;

--
-- Name: assaapp_customcoursetime_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_customcoursetime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_customcoursetime_id_seq OWNER TO root;

--
-- Name: assaapp_customcoursetime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_customcoursetime_id_seq OWNED BY public.assaapp_customcoursetime.id;


--
-- Name: assaapp_timetable; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_timetable (
    id integer NOT NULL,
    title character varying(64) NOT NULL,
    semester character varying(8) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.assaapp_timetable OWNER TO root;

--
-- Name: assaapp_timetable_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_timetable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_timetable_id_seq OWNER TO root;

--
-- Name: assaapp_timetable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_timetable_id_seq OWNED BY public.assaapp_timetable.id;


--
-- Name: assaapp_user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    email character varying(255) NOT NULL,
    username character varying(32) NOT NULL,
    grade integer NOT NULL,
    department character varying(64) NOT NULL,
    is_active boolean NOT NULL,
    is_admin boolean NOT NULL,
    timetable_main_id integer,
    credit_max integer NOT NULL,
    credit_min integer NOT NULL,
    days_per_week integer NOT NULL,
    major_max integer NOT NULL,
    major_min integer NOT NULL,
    last_recommend_page integer NOT NULL
);


ALTER TABLE public.assaapp_user OWNER TO root;

--
-- Name: assaapp_user_friends; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_user_friends (
    id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL
);


ALTER TABLE public.assaapp_user_friends OWNER TO root;

--
-- Name: assaapp_user_friends_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_user_friends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_user_friends_id_seq OWNER TO root;

--
-- Name: assaapp_user_friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_user_friends_id_seq OWNED BY public.assaapp_user_friends.id;


--
-- Name: assaapp_user_friends_request; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.assaapp_user_friends_request (
    id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer NOT NULL
);


ALTER TABLE public.assaapp_user_friends_request OWNER TO root;

--
-- Name: assaapp_user_friends_request_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_user_friends_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_user_friends_request_id_seq OWNER TO root;

--
-- Name: assaapp_user_friends_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_user_friends_request_id_seq OWNED BY public.assaapp_user_friends_request.id;


--
-- Name: assaapp_user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.assaapp_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assaapp_user_id_seq OWNER TO root;

--
-- Name: assaapp_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.assaapp_user_id_seq OWNED BY public.assaapp_user.id;


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO root;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO root;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO root;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO root;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO root;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO root;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO root;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO root;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO root;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO root;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO root;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO root;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO root;

--
-- Name: recommend_coursepref; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.recommend_coursepref (
    id integer NOT NULL,
    score integer NOT NULL,
    course_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.recommend_coursepref OWNER TO root;

--
-- Name: recommend_coursepref_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.recommend_coursepref_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommend_coursepref_id_seq OWNER TO root;

--
-- Name: recommend_coursepref_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.recommend_coursepref_id_seq OWNED BY public.recommend_coursepref.id;


--
-- Name: recommend_recommendcourse; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.recommend_recommendcourse (
    id integer NOT NULL,
    color character varying(8) NOT NULL,
    course_id integer NOT NULL,
    timetable_id integer NOT NULL
);


ALTER TABLE public.recommend_recommendcourse OWNER TO root;

--
-- Name: recommend_recommendcourse_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.recommend_recommendcourse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommend_recommendcourse_id_seq OWNER TO root;

--
-- Name: recommend_recommendcourse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.recommend_recommendcourse_id_seq OWNED BY public.recommend_recommendcourse.id;


--
-- Name: recommend_recommendtimetable; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.recommend_recommendtimetable (
    id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.recommend_recommendtimetable OWNER TO root;

--
-- Name: recommend_recommendtimetable_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.recommend_recommendtimetable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommend_recommendtimetable_id_seq OWNER TO root;

--
-- Name: recommend_recommendtimetable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.recommend_recommendtimetable_id_seq OWNED BY public.recommend_recommendtimetable.id;


--
-- Name: recommend_timepref; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.recommend_timepref (
    id integer NOT NULL,
    weekday integer NOT NULL,
    start_time time without time zone NOT NULL,
    score integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.recommend_timepref OWNER TO root;

--
-- Name: recommend_timepref_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.recommend_timepref_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommend_timepref_id_seq OWNER TO root;

--
-- Name: recommend_timepref_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.recommend_timepref_id_seq OWNED BY public.recommend_timepref.id;


--
-- Name: assaapp_building id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_building ALTER COLUMN id SET DEFAULT nextval('public.assaapp_building_id_seq'::regclass);


--
-- Name: assaapp_course id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_course ALTER COLUMN id SET DEFAULT nextval('public.assaapp_course_id_seq'::regclass);


--
-- Name: assaapp_coursetime id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_coursetime ALTER COLUMN id SET DEFAULT nextval('public.assaapp_coursetime_id_seq'::regclass);


--
-- Name: assaapp_customcourse id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcourse ALTER COLUMN id SET DEFAULT nextval('public.assaapp_customcourse_id_seq'::regclass);


--
-- Name: assaapp_customcoursetime id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcoursetime ALTER COLUMN id SET DEFAULT nextval('public.assaapp_customcoursetime_id_seq'::regclass);


--
-- Name: assaapp_timetable id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_timetable ALTER COLUMN id SET DEFAULT nextval('public.assaapp_timetable_id_seq'::regclass);


--
-- Name: assaapp_user id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user ALTER COLUMN id SET DEFAULT nextval('public.assaapp_user_id_seq'::regclass);


--
-- Name: assaapp_user_friends id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends ALTER COLUMN id SET DEFAULT nextval('public.assaapp_user_friends_id_seq'::regclass);


--
-- Name: assaapp_user_friends_request id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends_request ALTER COLUMN id SET DEFAULT nextval('public.assaapp_user_friends_request_id_seq'::regclass);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: recommend_coursepref id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_coursepref ALTER COLUMN id SET DEFAULT nextval('public.recommend_coursepref_id_seq'::regclass);


--
-- Name: recommend_recommendcourse id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendcourse ALTER COLUMN id SET DEFAULT nextval('public.recommend_recommendcourse_id_seq'::regclass);


--
-- Name: recommend_recommendtimetable id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendtimetable ALTER COLUMN id SET DEFAULT nextval('public.recommend_recommendtimetable_id_seq'::regclass);


--
-- Name: recommend_timepref id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_timepref ALTER COLUMN id SET DEFAULT nextval('public.recommend_timepref_id_seq'::regclass);


--
-- Data for Name: assaapp_building; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_building (id, name, latitude, longitude, repre_name) FROM stdin;
\.


--
-- Data for Name: assaapp_course; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_course (id, semester, classification, college, department, degree_program, academic_year, course_number, lecture_number, title, subtitle, credit, lecture_credit, lab_credit, lecture_type, "time", location, professor, quota, remark, language, status) FROM stdin;
\.


--
-- Data for Name: assaapp_coursetime; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_coursetime (id, lectureroom, weekday, start_time, end_time, building_id, course_id) FROM stdin;
\.


--
-- Data for Name: assaapp_customcourse; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_customcourse (id, title, color, course_id, timetable_id) FROM stdin;
\.


--
-- Data for Name: assaapp_customcoursetime; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_customcoursetime (id, lectureroom, weekday, start_time, end_time, building_id, course_id, timetable_id, detail) FROM stdin;
\.


--
-- Data for Name: assaapp_timetable; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_timetable (id, title, semester, user_id) FROM stdin;
\.


--
-- Data for Name: assaapp_user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_user (id, password, last_login, email, username, grade, department, is_active, is_admin, timetable_main_id, credit_max, credit_min, days_per_week, major_max, major_min, last_recommend_page) FROM stdin;
\.


--
-- Data for Name: assaapp_user_friends; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_user_friends (id, from_user_id, to_user_id) FROM stdin;
\.


--
-- Data for Name: assaapp_user_friends_request; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.assaapp_user_friends_request (id, from_user_id, to_user_id) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add user	1	add_user
2	Can change user	1	change_user
3	Can delete user	1	delete_user
4	Can view user	1	view_user
5	Can add building	2	add_building
6	Can change building	2	change_building
7	Can delete building	2	delete_building
8	Can view building	2	view_building
9	Can add course	3	add_course
10	Can change course	3	change_course
11	Can delete course	3	delete_course
12	Can view course	3	view_course
13	Can add custom course	4	add_customcourse
14	Can change custom course	4	change_customcourse
15	Can delete custom course	4	delete_customcourse
16	Can view custom course	4	view_customcourse
17	Can add timetable	5	add_timetable
18	Can change timetable	5	change_timetable
19	Can delete timetable	5	delete_timetable
20	Can view timetable	5	view_timetable
21	Can add custom course time	6	add_customcoursetime
22	Can change custom course time	6	change_customcoursetime
23	Can delete custom course time	6	delete_customcoursetime
24	Can view custom course time	6	view_customcoursetime
25	Can add course time	7	add_coursetime
26	Can change course time	7	change_coursetime
27	Can delete course time	7	delete_coursetime
28	Can view course time	7	view_coursetime
29	Can add time pref	8	add_timepref
30	Can change time pref	8	change_timepref
31	Can delete time pref	8	delete_timepref
32	Can view time pref	8	view_timepref
33	Can add course pref	9	add_coursepref
34	Can change course pref	9	change_coursepref
35	Can delete course pref	9	delete_coursepref
36	Can view course pref	9	view_coursepref
37	Can add recommend timetable	10	add_recommendtimetable
38	Can change recommend timetable	10	change_recommendtimetable
39	Can delete recommend timetable	10	delete_recommendtimetable
40	Can view recommend timetable	10	view_recommendtimetable
41	Can add recommend course	11	add_recommendcourse
42	Can change recommend course	11	change_recommendcourse
43	Can delete recommend course	11	delete_recommendcourse
44	Can view recommend course	11	view_recommendcourse
45	Can add log entry	12	add_logentry
46	Can change log entry	12	change_logentry
47	Can delete log entry	12	delete_logentry
48	Can view log entry	12	view_logentry
49	Can add permission	13	add_permission
50	Can change permission	13	change_permission
51	Can delete permission	13	delete_permission
52	Can view permission	13	view_permission
53	Can add group	14	add_group
54	Can change group	14	change_group
55	Can delete group	14	delete_group
56	Can view group	14	view_group
57	Can add content type	15	add_contenttype
58	Can change content type	15	change_contenttype
59	Can delete content type	15	delete_contenttype
60	Can view content type	15	view_contenttype
61	Can add session	16	add_session
62	Can change session	16	change_session
63	Can delete session	16	delete_session
64	Can view session	16	view_session
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	assaapp	user
2	assaapp	building
3	assaapp	course
4	assaapp	customcourse
5	assaapp	timetable
6	assaapp	customcoursetime
7	assaapp	coursetime
8	recommend	timepref
9	recommend	coursepref
10	recommend	recommendtimetable
11	recommend	recommendcourse
12	admin	logentry
13	auth	permission
14	auth	group
15	contenttypes	contenttype
16	sessions	session
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2019-12-16 16:29:06.862536+09
2	assaapp	0001_initial	2019-12-16 16:29:07.180046+09
3	admin	0001_initial	2019-12-16 16:29:07.616031+09
4	admin	0002_logentry_remove_auto_add	2019-12-16 16:29:07.690253+09
5	admin	0003_logentry_add_action_flag_choices	2019-12-16 16:29:07.700835+09
6	assaapp	0002_building_detail	2019-12-16 16:29:07.773903+09
7	assaapp	0002_auto_20191204_1955	2019-12-16 16:29:08.279226+09
8	assaapp	0003_merge_20191207_1342	2019-12-16 16:29:08.287085+09
9	assaapp	0004_auto_20191207_1744	2019-12-16 16:29:08.474302+09
10	assaapp	0005_auto_20191208_0858	2019-12-16 16:29:08.508498+09
11	assaapp	0003_user_last_recommend_page	2019-12-16 16:29:08.577012+09
12	assaapp	0006_merge_20191212_1030	2019-12-16 16:29:08.61462+09
13	assaapp	0007_user_recommend_base_timetable	2019-12-16 16:29:08.62939+09
14	assaapp	0007_auto_20191213_0432	2019-12-16 16:29:08.820055+09
15	assaapp	0008_merge_20191213_0756	2019-12-16 16:29:08.826923+09
16	assaapp	0009_auto_20191213_1324	2019-12-16 16:29:08.851301+09
17	assaapp	0010_remove_user_recommend_base_timetable	2019-12-16 16:29:08.871908+09
18	assaapp	0008_auto_20191214_0246	2019-12-16 16:29:08.975773+09
19	assaapp	0011_merge_20191214_0616	2019-12-16 16:29:08.982285+09
20	contenttypes	0002_remove_content_type_name	2019-12-16 16:29:09.00804+09
21	auth	0001_initial	2019-12-16 16:29:09.097236+09
22	auth	0002_alter_permission_name_max_length	2019-12-16 16:29:09.276295+09
23	auth	0003_alter_user_email_max_length	2019-12-16 16:29:09.287961+09
24	auth	0004_alter_user_username_opts	2019-12-16 16:29:09.299571+09
25	auth	0005_alter_user_last_login_null	2019-12-16 16:29:09.31093+09
26	auth	0006_require_contenttypes_0002	2019-12-16 16:29:09.317347+09
27	auth	0007_alter_validators_add_error_messages	2019-12-16 16:29:09.328799+09
28	auth	0008_alter_user_username_max_length	2019-12-16 16:29:09.340087+09
29	auth	0009_alter_user_last_name_max_length	2019-12-16 16:29:09.352506+09
30	auth	0010_alter_group_name_max_length	2019-12-16 16:29:09.364974+09
31	auth	0011_update_proxy_permissions	2019-12-16 16:29:09.386506+09
32	recommend	0001_initial	2019-12-16 16:29:09.447243+09
33	recommend	0002_auto_20191205_0706	2019-12-16 16:29:09.495817+09
34	recommend	0003_recommendcourse_recommendtimetable	2019-12-16 16:29:09.586645+09
35	sessions	0001_initial	2019-12-16 16:29:09.685797+09
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: recommend_coursepref; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.recommend_coursepref (id, score, course_id, user_id) FROM stdin;
\.


--
-- Data for Name: recommend_recommendcourse; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.recommend_recommendcourse (id, color, course_id, timetable_id) FROM stdin;
\.


--
-- Data for Name: recommend_recommendtimetable; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.recommend_recommendtimetable (id, user_id) FROM stdin;
\.


--
-- Data for Name: recommend_timepref; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.recommend_timepref (id, weekday, start_time, score, user_id) FROM stdin;
\.


--
-- Name: assaapp_building_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_building_id_seq', 1, false);


--
-- Name: assaapp_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_course_id_seq', 1, false);


--
-- Name: assaapp_coursetime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_coursetime_id_seq', 1, false);


--
-- Name: assaapp_customcourse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_customcourse_id_seq', 1, false);


--
-- Name: assaapp_customcoursetime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_customcoursetime_id_seq', 1, false);


--
-- Name: assaapp_timetable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_timetable_id_seq', 1, false);


--
-- Name: assaapp_user_friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_user_friends_id_seq', 1, false);


--
-- Name: assaapp_user_friends_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_user_friends_request_id_seq', 1, false);


--
-- Name: assaapp_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.assaapp_user_id_seq', 1, false);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 64, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 16, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 35, true);


--
-- Name: recommend_coursepref_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.recommend_coursepref_id_seq', 1, false);


--
-- Name: recommend_recommendcourse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.recommend_recommendcourse_id_seq', 1, false);


--
-- Name: recommend_recommendtimetable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.recommend_recommendtimetable_id_seq', 1, false);


--
-- Name: recommend_timepref_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.recommend_timepref_id_seq', 1, false);


--
-- Name: assaapp_building assaapp_building_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_building
    ADD CONSTRAINT assaapp_building_pkey PRIMARY KEY (id);


--
-- Name: assaapp_course assaapp_course_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_course
    ADD CONSTRAINT assaapp_course_pkey PRIMARY KEY (id);


--
-- Name: assaapp_coursetime assaapp_coursetime_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_coursetime
    ADD CONSTRAINT assaapp_coursetime_pkey PRIMARY KEY (id);


--
-- Name: assaapp_customcourse assaapp_customcourse_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcourse
    ADD CONSTRAINT assaapp_customcourse_pkey PRIMARY KEY (id);


--
-- Name: assaapp_customcoursetime assaapp_customcoursetime_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcoursetime
    ADD CONSTRAINT assaapp_customcoursetime_pkey PRIMARY KEY (id);


--
-- Name: assaapp_timetable assaapp_timetable_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_timetable
    ADD CONSTRAINT assaapp_timetable_pkey PRIMARY KEY (id);


--
-- Name: assaapp_user assaapp_user_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user
    ADD CONSTRAINT assaapp_user_email_key UNIQUE (email);


--
-- Name: assaapp_user_friends assaapp_user_friends_from_user_id_to_user_id_d514c9b4_uniq; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends
    ADD CONSTRAINT assaapp_user_friends_from_user_id_to_user_id_d514c9b4_uniq UNIQUE (from_user_id, to_user_id);


--
-- Name: assaapp_user_friends assaapp_user_friends_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends
    ADD CONSTRAINT assaapp_user_friends_pkey PRIMARY KEY (id);


--
-- Name: assaapp_user_friends_request assaapp_user_friends_req_from_user_id_to_user_id_8f198ef3_uniq; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends_request
    ADD CONSTRAINT assaapp_user_friends_req_from_user_id_to_user_id_8f198ef3_uniq UNIQUE (from_user_id, to_user_id);


--
-- Name: assaapp_user_friends_request assaapp_user_friends_request_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends_request
    ADD CONSTRAINT assaapp_user_friends_request_pkey PRIMARY KEY (id);


--
-- Name: assaapp_user assaapp_user_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user
    ADD CONSTRAINT assaapp_user_pkey PRIMARY KEY (id);


--
-- Name: assaapp_user assaapp_user_timetable_main_id_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user
    ADD CONSTRAINT assaapp_user_timetable_main_id_key UNIQUE (timetable_main_id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: recommend_coursepref recommend_coursepref_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_coursepref
    ADD CONSTRAINT recommend_coursepref_pkey PRIMARY KEY (id);


--
-- Name: recommend_recommendcourse recommend_recommendcourse_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendcourse
    ADD CONSTRAINT recommend_recommendcourse_pkey PRIMARY KEY (id);


--
-- Name: recommend_recommendtimetable recommend_recommendtimetable_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendtimetable
    ADD CONSTRAINT recommend_recommendtimetable_pkey PRIMARY KEY (id);


--
-- Name: recommend_timepref recommend_timepref_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_timepref
    ADD CONSTRAINT recommend_timepref_pkey PRIMARY KEY (id);


--
-- Name: assaapp_coursetime_building_id_c5c6d1db; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_coursetime_building_id_c5c6d1db ON public.assaapp_coursetime USING btree (building_id);


--
-- Name: assaapp_coursetime_course_id_fcb4c6b4; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_coursetime_course_id_fcb4c6b4 ON public.assaapp_coursetime USING btree (course_id);


--
-- Name: assaapp_customcourse_course_id_4204f00c; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_customcourse_course_id_4204f00c ON public.assaapp_customcourse USING btree (course_id);


--
-- Name: assaapp_customcourse_timetable_id_90cb9b3e; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_customcourse_timetable_id_90cb9b3e ON public.assaapp_customcourse USING btree (timetable_id);


--
-- Name: assaapp_customcoursetime_building_id_067b760d; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_customcoursetime_building_id_067b760d ON public.assaapp_customcoursetime USING btree (building_id);


--
-- Name: assaapp_customcoursetime_course_id_990f17e5; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_customcoursetime_course_id_990f17e5 ON public.assaapp_customcoursetime USING btree (course_id);


--
-- Name: assaapp_customcoursetime_timetable_id_47267c85; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_customcoursetime_timetable_id_47267c85 ON public.assaapp_customcoursetime USING btree (timetable_id);


--
-- Name: assaapp_timetable_user_id_fca4e343; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_timetable_user_id_fca4e343 ON public.assaapp_timetable USING btree (user_id);


--
-- Name: assaapp_user_email_a668bcde_like; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_user_email_a668bcde_like ON public.assaapp_user USING btree (email varchar_pattern_ops);


--
-- Name: assaapp_user_friends_from_user_id_a97765ee; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_user_friends_from_user_id_a97765ee ON public.assaapp_user_friends USING btree (from_user_id);


--
-- Name: assaapp_user_friends_request_from_user_id_c38e3c4f; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_user_friends_request_from_user_id_c38e3c4f ON public.assaapp_user_friends_request USING btree (from_user_id);


--
-- Name: assaapp_user_friends_request_to_user_id_2426c790; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_user_friends_request_to_user_id_2426c790 ON public.assaapp_user_friends_request USING btree (to_user_id);


--
-- Name: assaapp_user_friends_to_user_id_93a241ec; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX assaapp_user_friends_to_user_id_93a241ec ON public.assaapp_user_friends USING btree (to_user_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: recommend_coursepref_course_id_8e815bf6; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX recommend_coursepref_course_id_8e815bf6 ON public.recommend_coursepref USING btree (course_id);


--
-- Name: recommend_coursepref_user_id_d44487a0; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX recommend_coursepref_user_id_d44487a0 ON public.recommend_coursepref USING btree (user_id);


--
-- Name: recommend_recommendcourse_course_id_8690b919; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX recommend_recommendcourse_course_id_8690b919 ON public.recommend_recommendcourse USING btree (course_id);


--
-- Name: recommend_recommendcourse_timetable_id_ba361a71; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX recommend_recommendcourse_timetable_id_ba361a71 ON public.recommend_recommendcourse USING btree (timetable_id);


--
-- Name: recommend_recommendtimetable_user_id_8b45efcb; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX recommend_recommendtimetable_user_id_8b45efcb ON public.recommend_recommendtimetable USING btree (user_id);


--
-- Name: recommend_timepref_user_id_d678252b; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX recommend_timepref_user_id_d678252b ON public.recommend_timepref USING btree (user_id);


--
-- Name: assaapp_coursetime assaapp_coursetime_building_id_c5c6d1db_fk_assaapp_building_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_coursetime
    ADD CONSTRAINT assaapp_coursetime_building_id_c5c6d1db_fk_assaapp_building_id FOREIGN KEY (building_id) REFERENCES public.assaapp_building(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_coursetime assaapp_coursetime_course_id_fcb4c6b4_fk_assaapp_course_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_coursetime
    ADD CONSTRAINT assaapp_coursetime_course_id_fcb4c6b4_fk_assaapp_course_id FOREIGN KEY (course_id) REFERENCES public.assaapp_course(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_customcoursetime assaapp_customcourse_building_id_067b760d_fk_assaapp_b; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcoursetime
    ADD CONSTRAINT assaapp_customcourse_building_id_067b760d_fk_assaapp_b FOREIGN KEY (building_id) REFERENCES public.assaapp_building(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_customcourse assaapp_customcourse_course_id_4204f00c_fk_assaapp_course_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcourse
    ADD CONSTRAINT assaapp_customcourse_course_id_4204f00c_fk_assaapp_course_id FOREIGN KEY (course_id) REFERENCES public.assaapp_course(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_customcoursetime assaapp_customcourse_course_id_990f17e5_fk_assaapp_c; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcoursetime
    ADD CONSTRAINT assaapp_customcourse_course_id_990f17e5_fk_assaapp_c FOREIGN KEY (course_id) REFERENCES public.assaapp_customcourse(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_customcoursetime assaapp_customcourse_timetable_id_47267c85_fk_assaapp_t; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcoursetime
    ADD CONSTRAINT assaapp_customcourse_timetable_id_47267c85_fk_assaapp_t FOREIGN KEY (timetable_id) REFERENCES public.assaapp_timetable(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_customcourse assaapp_customcourse_timetable_id_90cb9b3e_fk_assaapp_t; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_customcourse
    ADD CONSTRAINT assaapp_customcourse_timetable_id_90cb9b3e_fk_assaapp_t FOREIGN KEY (timetable_id) REFERENCES public.assaapp_timetable(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_timetable assaapp_timetable_user_id_fca4e343_fk_assaapp_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_timetable
    ADD CONSTRAINT assaapp_timetable_user_id_fca4e343_fk_assaapp_user_id FOREIGN KEY (user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_user_friends assaapp_user_friends_from_user_id_a97765ee_fk_assaapp_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends
    ADD CONSTRAINT assaapp_user_friends_from_user_id_a97765ee_fk_assaapp_user_id FOREIGN KEY (from_user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_user_friends_request assaapp_user_friends_from_user_id_c38e3c4f_fk_assaapp_u; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends_request
    ADD CONSTRAINT assaapp_user_friends_from_user_id_c38e3c4f_fk_assaapp_u FOREIGN KEY (from_user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_user_friends_request assaapp_user_friends_to_user_id_2426c790_fk_assaapp_u; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends_request
    ADD CONSTRAINT assaapp_user_friends_to_user_id_2426c790_fk_assaapp_u FOREIGN KEY (to_user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_user_friends assaapp_user_friends_to_user_id_93a241ec_fk_assaapp_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user_friends
    ADD CONSTRAINT assaapp_user_friends_to_user_id_93a241ec_fk_assaapp_user_id FOREIGN KEY (to_user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assaapp_user assaapp_user_timetable_main_id_724bfa8a_fk_assaapp_timetable_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.assaapp_user
    ADD CONSTRAINT assaapp_user_timetable_main_id_724bfa8a_fk_assaapp_timetable_id FOREIGN KEY (timetable_main_id) REFERENCES public.assaapp_timetable(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_assaapp_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_assaapp_user_id FOREIGN KEY (user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: recommend_coursepref recommend_coursepref_course_id_8e815bf6_fk_assaapp_course_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_coursepref
    ADD CONSTRAINT recommend_coursepref_course_id_8e815bf6_fk_assaapp_course_id FOREIGN KEY (course_id) REFERENCES public.assaapp_course(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: recommend_coursepref recommend_coursepref_user_id_d44487a0_fk_assaapp_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_coursepref
    ADD CONSTRAINT recommend_coursepref_user_id_d44487a0_fk_assaapp_user_id FOREIGN KEY (user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: recommend_recommendcourse recommend_recommendc_course_id_8690b919_fk_assaapp_c; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendcourse
    ADD CONSTRAINT recommend_recommendc_course_id_8690b919_fk_assaapp_c FOREIGN KEY (course_id) REFERENCES public.assaapp_course(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: recommend_recommendcourse recommend_recommendc_timetable_id_ba361a71_fk_recommend; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendcourse
    ADD CONSTRAINT recommend_recommendc_timetable_id_ba361a71_fk_recommend FOREIGN KEY (timetable_id) REFERENCES public.recommend_recommendtimetable(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: recommend_recommendtimetable recommend_recommendt_user_id_8b45efcb_fk_assaapp_u; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_recommendtimetable
    ADD CONSTRAINT recommend_recommendt_user_id_8b45efcb_fk_assaapp_u FOREIGN KEY (user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: recommend_timepref recommend_timepref_user_id_d678252b_fk_assaapp_user_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.recommend_timepref
    ADD CONSTRAINT recommend_timepref_user_id_d678252b_fk_assaapp_user_id FOREIGN KEY (user_id) REFERENCES public.assaapp_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

