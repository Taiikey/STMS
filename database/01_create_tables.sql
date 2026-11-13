
-- ============================================================
-- School Transportation Management System
-- 01_create_tables.sql (Oracle 12c or newer)
-- Creation order: parents first, then children (FK dependency)
-- ============================================================

-- ------------------------------------------------------------
-- 1) Tables with no dependencies
-- ------------------------------------------------------------

CREATE TABLE USERS (
    UserId     NUMBER GENERATED ALWAYS AS IDENTITY,
    Email      VARCHAR2(150) NOT NULL,
    Password   VARCHAR2(255) NOT NULL, -- BCrypt HASH only
    Role       VARCHAR2(20)  NOT NULL,
    IsActive   NUMBER(1) DEFAULT 1 NOT NULL,
    CreatedAt  DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT PK_USERS PRIMARY KEY (UserId),
    CONSTRAINT UQ_USERS_EMAIL UNIQUE (Email),
    CONSTRAINT CK_USERS_ROLE CHECK (Role IN ('Parent', 'Admin')),
    CONSTRAINT CK_USERS_ACTIVE CHECK (IsActive IN (0, 1))
);

CREATE TABLE BUSES (
    BusId        NUMBER GENERATED ALWAYS AS IDENTITY,
    PlateNumber  VARCHAR2(20) NOT NULL,
    Capacity     NUMBER NOT NULL,
    IsActive     NUMBER(1) DEFAULT 1 NOT NULL,

    CONSTRAINT PK_BUSES PRIMARY KEY (BusId),
    CONSTRAINT UQ_BUSES_PLATE UNIQUE (PlateNumber),
    CONSTRAINT CK_BUSES_CAP CHECK (Capacity > 0),
    CONSTRAINT CK_BUSES_ACTIVE CHECK (IsActive IN (0, 1))
);

CREATE TABLE DRIVERS (
    DriverId       NUMBER GENERATED ALWAYS AS IDENTITY,
    FullName       VARCHAR2(150) NOT NULL,
    Phone          VARCHAR2(20) NOT NULL,
    LicenseNumber  VARCHAR2(50),
    IsActive       NUMBER(1) DEFAULT 1 NOT NULL,

    CONSTRAINT PK_DRIVERS PRIMARY KEY (DriverId),
    CONSTRAINT UQ_DRIVERS_LIC UNIQUE (LicenseNumber),
    CONSTRAINT CK_DRIVERS_ACTIVE CHECK (IsActive IN (0, 1))
);

-- ------------------------------------------------------------
-- 2) Tables depending on level 1
-- ------------------------------------------------------------

CREATE TABLE PARENTS (
    ParentId  NUMBER GENERATED ALWAYS AS IDENTITY,
    UserId    NUMBER NOT NULL,
    FullName  VARCHAR2(150) NOT NULL,
    Phone     VARCHAR2(20) NOT NULL,
    Address   VARCHAR2(250) NOT NULL,

    CONSTRAINT PK_PARENTS PRIMARY KEY (ParentId),
    CONSTRAINT UQ_PARENTS_USER UNIQUE (UserId),
    CONSTRAINT FK_PARENTS_USER
        FOREIGN KEY (UserId) REFERENCES USERS (UserId)
);

-- BusId and DriverId are optional
CREATE TABLE ROUTES (
    RouteId      NUMBER GENERATED ALWAYS AS IDENTITY,
    RouteNumber  VARCHAR2(20) NOT NULL,
    Name         VARCHAR2(150) NOT NULL,
    StartPoint   VARCHAR2(150) NOT NULL,
    Destination  VARCHAR2(150) NOT NULL,
    ServiceArea  VARCHAR2(100) NOT NULL,
    Capacity     NUMBER NOT NULL,
    IsActive     NUMBER(1) DEFAULT 1 NOT NULL,
    BusId        NUMBER,
    DriverId     NUMBER,

    CONSTRAINT PK_ROUTES PRIMARY KEY (RouteId),
    CONSTRAINT UQ_ROUTES_NUMBER UNIQUE (RouteNumber),
    CONSTRAINT CK_ROUTES_CAP CHECK (Capacity > 0),
    CONSTRAINT CK_ROUTES_ACTIVE CHECK (IsActive IN (0, 1)),
    CONSTRAINT FK_ROUTES_BUS
        FOREIGN KEY (BusId) REFERENCES BUSES (BusId),
    CONSTRAINT FK_ROUTES_DRIVER
        FOREIGN KEY (DriverId) REFERENCES DRIVERS (DriverId)
);

-- ------------------------------------------------------------
-- 3) Tables depending on level 2
-- ------------------------------------------------------------

CREATE TABLE STUDENTS (
    StudentId    NUMBER GENERATED ALWAYS AS IDENTITY,
    ParentId     NUMBER NOT NULL,
    FullName     VARCHAR2(150) NOT NULL,
    Grade        VARCHAR2(20) NOT NULL,
    ClassName    VARCHAR2(20) NOT NULL,
    DateOfBirth  DATE,
    Notes        VARCHAR2(500),

    CONSTRAINT PK_STUDENTS PRIMARY KEY (StudentId),
    CONSTRAINT FK_STUDENTS_PARENT
        FOREIGN KEY (ParentId) REFERENCES PARENTS (ParentId)
);

CREATE TABLE STOPS (
    StopId       NUMBER GENERATED ALWAYS AS IDENTITY,
    RouteId      NUMBER NOT NULL,
    Name         VARCHAR2(150) NOT NULL,
    StopOrder    NUMBER NOT NULL,
    PickupTime   VARCHAR2(5),
    DropoffTime  VARCHAR2(5),

    CONSTRAINT PK_STOPS PRIMARY KEY (StopId),
    CONSTRAINT FK_STOPS_ROUTE
        FOREIGN KEY (RouteId) REFERENCES ROUTES (RouteId),
    CONSTRAINT UQ_STOPS_ORDER UNIQUE (RouteId, StopOrder),
    CONSTRAINT CK_STOPS_ORDER CHECK (StopOrder > 0),
    CONSTRAINT CK_STOPS_PICKUP CHECK (
        PickupTime IS NULL OR
        REGEXP_LIKE(
            PickupTime,
            '^([01][0-9]|2[0-3]):[0-5][0-9]$'
        )
    ),
    CONSTRAINT CK_STOPS_DROPOFF CHECK (
        DropoffTime IS NULL OR
        REGEXP_LIKE(
            DropoffTime,
            '^([01][0-9]|2[0-3]):[0-5][0-9]$'
        )
    )
);

-- ------------------------------------------------------------
-- 4) SUBSCRIPTIONS
-- ------------------------------------------------------------

CREATE TABLE SUBSCRIPTIONS (
    SubscriptionId   NUMBER GENERATED ALWAYS AS IDENTITY,
    ReferenceNumber  VARCHAR2(30) NOT NULL,
    StudentId        NUMBER NOT NULL,
    RouteId          NUMBER NOT NULL,
    StopId           NUMBER NOT NULL,
    TransportType    VARCHAR2(20) NOT NULL,
    Fee              NUMBER(10,2) NOT NULL,
    Status           VARCHAR2(20) DEFAULT 'Pending' NOT NULL,
    StartDate        DATE NOT NULL,
    EndDate          DATE NOT NULL,
    RequestedAt      DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT PK_SUBS PRIMARY KEY (SubscriptionId),
    CONSTRAINT UQ_SUBS_REF UNIQUE (ReferenceNumber),
    CONSTRAINT FK_SUBS_STUDENT
        FOREIGN KEY (StudentId) REFERENCES STUDENTS (StudentId),
    CONSTRAINT FK_SUBS_ROUTE
        FOREIGN KEY (RouteId) REFERENCES ROUTES (RouteId),
    CONSTRAINT FK_SUBS_STOP
        FOREIGN KEY (StopId) REFERENCES STOPS (StopId),
    CONSTRAINT CK_SUBS_TYPE
        CHECK (TransportType IN ('OneWay', 'RoundTrip')),
    CONSTRAINT CK_SUBS_STATUS
        CHECK (Status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    CONSTRAINT CK_SUBS_FEE CHECK (Fee >= 0),
    CONSTRAINT CK_SUBS_DATES CHECK (EndDate >= StartDate)
);

-- ------------------------------------------------------------
-- 5) Tables depending on SUBSCRIPTIONS
-- ------------------------------------------------------------

-- Payments are recorded manually by an admin.
-- One payment summary record per subscription.

CREATE TABLE PAYMENTS (
    PaymentId       NUMBER GENERATED ALWAYS AS IDENTITY,
    SubscriptionId  NUMBER NOT NULL,
    AmountDue       NUMBER(10,2) NOT NULL,
    AmountPaid      NUMBER(10,2) DEFAULT 0 NOT NULL,
    Status          VARCHAR2(20) DEFAULT 'Unpaid' NOT NULL,
    PaymentDate     DATE,
    RecordedBy      NUMBER,
    Notes           VARCHAR2(300),

    CONSTRAINT PK_PAYMENTS PRIMARY KEY (PaymentId),

    -- Prevent duplicate payment records for one subscription
    CONSTRAINT UQ_PAY_SUB UNIQUE (SubscriptionId),

    CONSTRAINT FK_PAY_SUB
        FOREIGN KEY (SubscriptionId)
        REFERENCES SUBSCRIPTIONS (SubscriptionId),

    CONSTRAINT FK_PAY_RECORDER
        FOREIGN KEY (RecordedBy)
        REFERENCES USERS (UserId),

    CONSTRAINT CK_PAY_STATUS
        CHECK (Status IN ('Unpaid', 'Partial', 'Paid')),

    CONSTRAINT CK_PAY_DUE
        CHECK (AmountDue >= 0),

    CONSTRAINT CK_PAY_PAID
        CHECK (AmountPaid >= 0 AND AmountPaid <= AmountDue)
);

CREATE TABLE CHANGE_REQUESTS (
    RequestId       NUMBER GENERATED ALWAYS AS IDENTITY,
    SubscriptionId  NUMBER NOT NULL,
    RequestType     VARCHAR2(20) NOT NULL,
    Reason          VARCHAR2(500),
    Status          VARCHAR2(20) DEFAULT 'Pending' NOT NULL,
    RequestedAt     DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT PK_CHGREQ PRIMARY KEY (RequestId),

    CONSTRAINT FK_CHGREQ_SUB
        FOREIGN KEY (SubscriptionId)
        REFERENCES SUBSCRIPTIONS (SubscriptionId),

    CONSTRAINT CK_CHGREQ_TYPE
        CHECK (RequestType IN ('Cancel', 'Modify')),

    CONSTRAINT CK_CHGREQ_STATUS
        CHECK (Status IN ('Pending', 'Approved', 'Rejected'))
);

-- ------------------------------------------------------------
-- 6) Indexes on foreign keys
-- ------------------------------------------------------------

CREATE INDEX IX_STUDENTS_PARENT
    ON STUDENTS (ParentId);

CREATE INDEX IX_ROUTES_BUS
    ON ROUTES (BusId);

CREATE INDEX IX_ROUTES_DRIVER
    ON ROUTES (DriverId);

CREATE INDEX IX_SUBS_STUDENT
    ON SUBSCRIPTIONS (StudentId);

CREATE INDEX IX_SUBS_ROUTE
    ON SUBSCRIPTIONS (RouteId);

CREATE INDEX IX_SUBS_STOP
    ON SUBSCRIPTIONS (StopId);

-- No IX_PAY_SUB needed:
-- UQ_PAY_SUB already provides an index on SubscriptionId.

CREATE INDEX IX_CHGREQ_SUB
    ON CHANGE_REQUESTS (SubscriptionId);

COMMIT;
