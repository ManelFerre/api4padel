--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-03-29 08:19:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 3079 OID 16749)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 2 (class 3079 OID 16738)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 279 (class 1255 OID 17080)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 17223)
-- Name: clubs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clubs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    logo character varying(100),
    website character varying(255),
    contact_email character varying(255),
    contact_phone character varying(20),
    country character varying(50) NOT NULL,
    province character varying(50) NOT NULL,
    city character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clubs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16854)
-- Name: group_invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_invitations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    group_id uuid NOT NULL,
    invited_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    email character varying NOT NULL,
    token character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.group_invitations OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16831)
-- Name: group_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_members (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    role character varying DEFAULT 'player'::character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL
);


ALTER TABLE public.group_members OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16818)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text,
    is_public boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    image_url character varying,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    club_id uuid NOT NULL
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16925)
-- Name: match_pairs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_pairs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    match_id uuid NOT NULL,
    player1_id uuid NOT NULL,
    player2_id uuid NOT NULL,
    court_number integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.match_pairs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16902)
-- Name: match_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_registrations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    match_id uuid NOT NULL,
    user_id uuid NOT NULL,
    level integer DEFAULT 5 NOT NULL,
    availability character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    notes character varying
);


ALTER TABLE public.match_registrations OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16952)
-- Name: match_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_results (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    match_id uuid NOT NULL,
    pair1_id uuid NOT NULL,
    pair2_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    set1_pair1 integer NOT NULL,
    set1_pair2 integer NOT NULL,
    set2_pair1 integer NOT NULL,
    set2_pair2 integer NOT NULL,
    set3_pair1 integer,
    set3_pair2 integer,
    comments character varying
);


ALTER TABLE public.match_results OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16877)
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    max_players integer DEFAULT 4 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    date timestamp with time zone NOT NULL,
    duration integer NOT NULL,
    courts integer DEFAULT 1 NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    title character varying NOT NULL,
    description character varying,
    group_id character varying,
    created_by character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17036)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone,
    type character varying NOT NULL,
    title character varying NOT NULL,
    related_entity_type character varying,
    related_entity_id character varying,
    status character varying DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17010)
-- Name: pair_statistics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pair_statistics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    player1_id uuid NOT NULL,
    player2_id uuid NOT NULL,
    group_id uuid NOT NULL,
    matches_played integer DEFAULT 0 NOT NULL,
    matches_won integer DEFAULT 0 NOT NULL,
    last_played timestamp with time zone
);


ALTER TABLE public.pair_statistics OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17052)
-- Name: user_notification_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notification_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    email_match_creation boolean DEFAULT true NOT NULL,
    email_match_reminder boolean DEFAULT true NOT NULL,
    email_match_results boolean DEFAULT true NOT NULL,
    push_match_creation boolean DEFAULT true NOT NULL,
    push_match_reminder boolean DEFAULT true NOT NULL,
    push_match_results boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_notification_settings OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16987)
-- Name: user_statistics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_statistics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    group_id uuid NOT NULL,
    matches_played integer DEFAULT 0 NOT NULL,
    matches_won integer DEFAULT 0 NOT NULL,
    sets_won integer DEFAULT 0 NOT NULL,
    sets_lost integer DEFAULT 0 NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_statistics OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16786)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    level integer DEFAULT 5 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_login timestamp with time zone,
    email_verified boolean DEFAULT false NOT NULL,
    password character varying NOT NULL,
    profile_picture character varying,
    login_attempts integer DEFAULT 0 NOT NULL,
    last_failed_login timestamp with time zone,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    status character varying DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16803)
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    token character varying NOT NULL,
    type character varying NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO postgres;

--
-- TOC entry 4883 (class 2606 OID 17120)
-- Name: user_notification_settings UQ_52182ffd0f785e8256f8fcb4fd6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT "UQ_52182ffd0f785e8256f8fcb4fd6" UNIQUE (user_id);


--
-- TOC entry 4856 (class 2606 OID 17095)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 4887 (class 2606 OID 17233)
-- Name: clubs clubs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16864)
-- Name: group_invitations group_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invitations
    ADD CONSTRAINT group_invitations_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 16841)
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 16830)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 16932)
-- Name: match_pairs match_pairs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_pairs
    ADD CONSTRAINT match_pairs_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 16912)
-- Name: match_registrations match_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_registrations
    ADD CONSTRAINT match_registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 16964)
-- Name: match_results match_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_results
    ADD CONSTRAINT match_results_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16891)
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 17046)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 17018)
-- Name: pair_statistics pair_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pair_statistics
    ADD CONSTRAINT pair_statistics_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 17064)
-- Name: user_notification_settings user_notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT user_notification_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 16997)
-- Name: user_statistics user_statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT user_statistics_pkey PRIMARY KEY (id);


--
-- TOC entry 4858 (class 2606 OID 16800)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 16811)
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 1259 OID 17235)
-- Name: idx_clubs_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clubs_city ON public.clubs USING btree (city);


--
-- TOC entry 4889 (class 1259 OID 17234)
-- Name: idx_clubs_country_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clubs_country_province ON public.clubs USING btree (country, province);


--
-- TOC entry 4890 (class 1259 OID 17236)
-- Name: idx_clubs_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clubs_name ON public.clubs USING btree (name);


--
-- TOC entry 4863 (class 1259 OID 17242)
-- Name: idx_groups_club_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_groups_club_id ON public.groups USING btree (club_id);


--
-- TOC entry 4913 (class 2620 OID 17082)
-- Name: groups update_groups_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_groups_timestamp BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4915 (class 2620 OID 17084)
-- Name: match_results update_match_results_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_match_results_timestamp BEFORE UPDATE ON public.match_results FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4914 (class 2620 OID 17083)
-- Name: matches update_matches_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_matches_timestamp BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4912 (class 2620 OID 17081)
-- Name: users update_users_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4907 (class 2606 OID 17213)
-- Name: pair_statistics FK_0fe15ae6adb405264567e9cd12a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pair_statistics
    ADD CONSTRAINT "FK_0fe15ae6adb405264567e9cd12a" FOREIGN KEY (player2_id) REFERENCES public.users(id);


--
-- TOC entry 4905 (class 2606 OID 17203)
-- Name: user_statistics FK_115ae3958ff779ce6b48754ecca; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT "FK_115ae3958ff779ce6b48754ecca" FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 4902 (class 2606 OID 17183)
-- Name: match_results FK_12a82779526594b1b3c0273b498; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_results
    ADD CONSTRAINT "FK_12a82779526594b1b3c0273b498" FOREIGN KEY (pair2_id) REFERENCES public.match_pairs(id);


--
-- TOC entry 4893 (class 2606 OID 17133)
-- Name: group_members FK_20a555b299f75843aa53ff8b0ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT "FK_20a555b299f75843aa53ff8b0ee" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4903 (class 2606 OID 17178)
-- Name: match_results FK_239793ef173e14a3c15613b46d8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_results
    ADD CONSTRAINT "FK_239793ef173e14a3c15613b46d8" FOREIGN KEY (pair1_id) REFERENCES public.match_pairs(id);


--
-- TOC entry 4894 (class 2606 OID 17128)
-- Name: group_members FK_2c840df5db52dc6b4a1b0b69c6e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT "FK_2c840df5db52dc6b4a1b0b69c6e" FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 4895 (class 2606 OID 17138)
-- Name: group_invitations FK_312f24bd763f755ac2c1604083c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invitations
    ADD CONSTRAINT "FK_312f24bd763f755ac2c1604083c" FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 4891 (class 2606 OID 17123)
-- Name: verification_tokens FK_31d2079dc4079b80517d31cf4f2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT "FK_31d2079dc4079b80517d31cf4f2" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4908 (class 2606 OID 17218)
-- Name: pair_statistics FK_4e835a6f346267b2a81d7415e37; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pair_statistics
    ADD CONSTRAINT "FK_4e835a6f346267b2a81d7415e37" FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- TOC entry 4911 (class 2606 OID 17193)
-- Name: user_notification_settings FK_52182ffd0f785e8256f8fcb4fd6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT "FK_52182ffd0f785e8256f8fcb4fd6" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4906 (class 2606 OID 17198)
-- Name: user_statistics FK_6c4dc06468a467954bfe446ebdd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT "FK_6c4dc06468a467954bfe446ebdd" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4897 (class 2606 OID 17153)
-- Name: match_registrations FK_73483733051291f762c548580a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_registrations
    ADD CONSTRAINT "FK_73483733051291f762c548580a0" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4909 (class 2606 OID 17208)
-- Name: pair_statistics FK_78fc0441892be27bbc6d603db29; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pair_statistics
    ADD CONSTRAINT "FK_78fc0441892be27bbc6d603db29" FOREIGN KEY (player1_id) REFERENCES public.users(id);


--
-- TOC entry 4910 (class 2606 OID 17188)
-- Name: notifications FK_9a8a82462cab47c73d25f49261f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4898 (class 2606 OID 17148)
-- Name: match_registrations FK_9c55f1d652eb5112ba7b5acd089; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_registrations
    ADD CONSTRAINT "FK_9c55f1d652eb5112ba7b5acd089" FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- TOC entry 4896 (class 2606 OID 17143)
-- Name: group_invitations FK_9e0040b82d3da3e851a45f60b3e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invitations
    ADD CONSTRAINT "FK_9e0040b82d3da3e851a45f60b3e" FOREIGN KEY (invited_by) REFERENCES public.users(id);


--
-- TOC entry 4899 (class 2606 OID 17158)
-- Name: match_pairs FK_ca2fe61e953ade7d32cdd24cd02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_pairs
    ADD CONSTRAINT "FK_ca2fe61e953ade7d32cdd24cd02" FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- TOC entry 4900 (class 2606 OID 17168)
-- Name: match_pairs FK_d21ec5194c36e06cb72fd23a813; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_pairs
    ADD CONSTRAINT "FK_d21ec5194c36e06cb72fd23a813" FOREIGN KEY (player2_id) REFERENCES public.users(id);


--
-- TOC entry 4901 (class 2606 OID 17163)
-- Name: match_pairs FK_d5fb7e25b059a3df3d93b57ad37; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_pairs
    ADD CONSTRAINT "FK_d5fb7e25b059a3df3d93b57ad37" FOREIGN KEY (player1_id) REFERENCES public.users(id);


--
-- TOC entry 4904 (class 2606 OID 17173)
-- Name: match_results FK_e9d504d20c43a4b5cdb355e7f8e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_results
    ADD CONSTRAINT "FK_e9d504d20c43a4b5cdb355e7f8e" FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- TOC entry 4892 (class 2606 OID 17237)
-- Name: groups fk_groups_club; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fk_groups_club FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


-- Completed on 2025-03-29 08:19:26

--
-- PostgreSQL database dump complete
--

