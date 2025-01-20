--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

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
-- Name: enum_Accounts_type; Type: TYPE; Schema: public; Owner: bankuser
--

CREATE TYPE public."enum_Accounts_type" AS ENUM (
    'bank',
    'cash',
    'mobile_money',
    'other'
);


ALTER TYPE public."enum_Accounts_type" OWNER TO bankuser;

--
-- Name: enum_Budgets_period; Type: TYPE; Schema: public; Owner: bankuser
--

CREATE TYPE public."enum_Budgets_period" AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'yearly'
);


ALTER TYPE public."enum_Budgets_period" OWNER TO bankuser;

--
-- Name: enum_Categories_type; Type: TYPE; Schema: public; Owner: bankuser
--

CREATE TYPE public."enum_Categories_type" AS ENUM (
    'income',
    'expense'
);


ALTER TYPE public."enum_Categories_type" OWNER TO bankuser;

--
-- Name: enum_Transactions_status; Type: TYPE; Schema: public; Owner: bankuser
--

CREATE TYPE public."enum_Transactions_status" AS ENUM (
    'completed',
    'pending',
    'cancelled'
);


ALTER TYPE public."enum_Transactions_status" OWNER TO bankuser;

--
-- Name: enum_Transactions_type; Type: TYPE; Schema: public; Owner: bankuser
--

CREATE TYPE public."enum_Transactions_type" AS ENUM (
    'income',
    'expense',
    'transfer'
);


ALTER TYPE public."enum_Transactions_type" OWNER TO bankuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Accounts; Type: TABLE; Schema: public; Owner: bankuser
--

CREATE TABLE public."Accounts" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name character varying(255) NOT NULL,
    type public."enum_Accounts_type" NOT NULL,
    balance numeric(10,2) DEFAULT 0,
    currency character varying(255) DEFAULT 'USD'::character varying,
    description text,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Accounts" OWNER TO bankuser;

--
-- Name: Accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: bankuser
--

CREATE SEQUENCE public."Accounts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Accounts_id_seq" OWNER TO bankuser;

--
-- Name: Accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bankuser
--

ALTER SEQUENCE public."Accounts_id_seq" OWNED BY public."Accounts".id;


--
-- Name: Budgets; Type: TABLE; Schema: public; Owner: bankuser
--

CREATE TABLE public."Budgets" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "categoryId" integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    period public."enum_Budgets_period" DEFAULT 'monthly'::public."enum_Budgets_period",
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    notifications jsonb DEFAULT '{"enabled": true, "threshold": 80}'::jsonb,
    "currentSpending" numeric(10,2) DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Budgets" OWNER TO bankuser;

--
-- Name: Budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: bankuser
--

CREATE SEQUENCE public."Budgets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Budgets_id_seq" OWNER TO bankuser;

--
-- Name: Budgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bankuser
--

ALTER SEQUENCE public."Budgets_id_seq" OWNED BY public."Budgets".id;


--
-- Name: Categories; Type: TABLE; Schema: public; Owner: bankuser
--

CREATE TABLE public."Categories" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name character varying(255) NOT NULL,
    type public."enum_Categories_type" NOT NULL,
    "parentId" integer,
    color character varying(255) DEFAULT '#000000'::character varying,
    icon character varying(255) DEFAULT 'default-icon'::character varying,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO bankuser;

--
-- Name: Categories_id_seq; Type: SEQUENCE; Schema: public; Owner: bankuser
--

CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Categories_id_seq" OWNER TO bankuser;

--
-- Name: Categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bankuser
--

ALTER SEQUENCE public."Categories_id_seq" OWNED BY public."Categories".id;


--
-- Name: Transactions; Type: TABLE; Schema: public; Owner: bankuser
--

CREATE TABLE public."Transactions" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "accountId" integer NOT NULL,
    "categoryId" integer NOT NULL,
    type public."enum_Transactions_type" NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    date timestamp with time zone,
    status public."enum_Transactions_status" DEFAULT 'completed'::public."enum_Transactions_status",
    attachments jsonb DEFAULT '[]'::jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Transactions" OWNER TO bankuser;

--
-- Name: Transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: bankuser
--

CREATE SEQUENCE public."Transactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Transactions_id_seq" OWNER TO bankuser;

--
-- Name: Transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bankuser
--

ALTER SEQUENCE public."Transactions_id_seq" OWNED BY public."Transactions".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: bankuser
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO bankuser;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: bankuser
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO bankuser;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bankuser
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Accounts id; Type: DEFAULT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Accounts" ALTER COLUMN id SET DEFAULT nextval('public."Accounts_id_seq"'::regclass);


--
-- Name: Budgets id; Type: DEFAULT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Budgets" ALTER COLUMN id SET DEFAULT nextval('public."Budgets_id_seq"'::regclass);


--
-- Name: Categories id; Type: DEFAULT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Categories" ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);


--
-- Name: Transactions id; Type: DEFAULT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Transactions" ALTER COLUMN id SET DEFAULT nextval('public."Transactions_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Accounts; Type: TABLE DATA; Schema: public; Owner: bankuser
--

COPY public."Accounts" (id, "userId", name, type, balance, currency, description, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Budgets; Type: TABLE DATA; Schema: public; Owner: bankuser
--

COPY public."Budgets" (id, "userId", "categoryId", amount, period, "startDate", "endDate", notifications, "currentSpending", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: bankuser
--

COPY public."Categories" (id, "userId", name, type, "parentId", color, icon, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Transactions; Type: TABLE DATA; Schema: public; Owner: bankuser
--

COPY public."Transactions" (id, "userId", "accountId", "categoryId", type, amount, description, date, status, attachments, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: bankuser
--

COPY public."Users" (id, name, email, password, "createdAt", "updatedAt") FROM stdin;
1	Eric Test	eric@test.com	$2a$10$95ULwYbZPb2rLuweGFrj4ORm9BKeVqjXtCm6swYf9im6FybPYUf7G	2025-01-16 17:53:59.136+02	2025-01-16 17:53:59.136+02
2	rene Test	rene@test.com	$2a$10$GQiq7k8IGJtmp0boYy2JWu0sT.hfWlJUPqGWoHUpOfm8WBEHUqDb2	2025-01-17 16:42:49.701+02	2025-01-17 16:42:49.701+02
3	blue Test	Blue@test.com	$2a$10$l3hXhREoHssbnl2mOCOmIex4Ik8XcEojCtQvQh4dcsaZcY3BASSha	2025-01-17 17:35:58.89+02	2025-01-17 17:35:58.89+02
4	black Test	black@test.com	$2a$10$thKXJv3kSzGHixWBdJlruuhXOFOHtePFcxBnegveWWiBzqBwpsjZ6	2025-01-17 17:39:22.533+02	2025-01-17 17:39:22.533+02
5	red Test	red@test.com	$2a$10$AU9O9U7AvMyImhgBYRMEgO3NGo4k3nj5LlrqHGQH0jCimsVWIfnoi	2025-01-17 17:41:18.471+02	2025-01-17 17:41:18.471+02
6	blasian Test	blasian@test.com	$2a$10$Jz7RlMQhb4h2Cs30vmVj0uiOLD303HVhbAkfaZ.e/X843DTNUupdu	2025-01-17 18:57:11.38+02	2025-01-17 18:57:11.38+02
7	blasian Test	blasi@test.com	$2a$10$iKhh3rc1LbIE4WC9oP2s3.p2sCRELrLDfdlY34/BuacfSwmTp8vOC	2025-01-17 19:59:53.699+02	2025-01-17 19:59:53.699+02
\.


--
-- Name: Accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bankuser
--

SELECT pg_catalog.setval('public."Accounts_id_seq"', 1, false);


--
-- Name: Budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bankuser
--

SELECT pg_catalog.setval('public."Budgets_id_seq"', 1, false);


--
-- Name: Categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bankuser
--

SELECT pg_catalog.setval('public."Categories_id_seq"', 1, false);


--
-- Name: Transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bankuser
--

SELECT pg_catalog.setval('public."Transactions_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bankuser
--

SELECT pg_catalog.setval('public."Users_id_seq"', 7, true);


--
-- Name: Accounts Accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Accounts"
    ADD CONSTRAINT "Accounts_pkey" PRIMARY KEY (id);


--
-- Name: Budgets Budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Budgets"
    ADD CONSTRAINT "Budgets_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key10; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key10" UNIQUE (email);


--
-- Name: Users Users_email_key11; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key11" UNIQUE (email);


--
-- Name: Users Users_email_key12; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key12" UNIQUE (email);


--
-- Name: Users Users_email_key13; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key13" UNIQUE (email);


--
-- Name: Users Users_email_key14; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key14" UNIQUE (email);


--
-- Name: Users Users_email_key15; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key15" UNIQUE (email);


--
-- Name: Users Users_email_key16; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key16" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: budgets_start_date_end_date; Type: INDEX; Schema: public; Owner: bankuser
--

CREATE INDEX budgets_start_date_end_date ON public."Budgets" USING btree ("startDate", "endDate");


--
-- Name: transactions_date; Type: INDEX; Schema: public; Owner: bankuser
--

CREATE INDEX transactions_date ON public."Transactions" USING btree (date);


--
-- Name: Accounts Accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Accounts"
    ADD CONSTRAINT "Accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Budgets Budgets_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Budgets"
    ADD CONSTRAINT "Budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Budgets Budgets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Budgets"
    ADD CONSTRAINT "Budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Categories Categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Categories"(id) ON UPDATE CASCADE;


--
-- Name: Categories Categories_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transactions Transactions_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Accounts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transactions Transactions_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transactions Transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bankuser
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

