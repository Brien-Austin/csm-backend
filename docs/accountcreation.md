# Feature 1 – Account Creation
## Deep Development / Data Point / Data Dictionary / Module 1 Relationships

**Purpose:** Define the Account data model, collection method, field types, stored values, refresh cadence, validation, and how the Account connects to the remaining Manual Data Intake features.

**Product decision:** Required vs optional is intentionally TBD. System-managed fields are marked System. Suggested fixed values are starting defaults and belong in the Data Dictionary.

---

## 1. Account Identity

| Data Point | Details |
|---|---|
| **Account Name** | Free text · Collected by CSM · Cadence: Create; name change · Used for search, display and duplicate detection |
| **Account ID** | UUID · System-generated · Immutable primary relational key |
| **External Account ID** | Free text · Collected by CSM / Import · Store with External Source |
| **External Source** | Fixed enum: `Salesforce`, `HubSpot`, `Other` · Supports future CRM imports |
| **Account Type** | Fixed enum: `Customer`, `Prospect`, `Partner`, `Reseller`, `Former Customer`, `Trial` · Different concept from lifecycle stage |
| **Website** | URL · Validate URL format |
| **Account Domain** | Domain · Normalised internet domain · Useful for matching Contacts and imports |

---

## 2. Headquarters and Geography

> **Important geography rule:** Do not collapse all geography into Region. HQ geography describes headquarters; Operating geography describes footprint/user distribution; Reporting Region is a reporting abstraction.

| Data Point | Details |
|---|---|
| **HQ Country** | Fixed enum · Standardised country list |
| **HQ State / Province** | Dependent enum · Choices depend on Country |
| **Operating Countries** | Multi-select fixed values · Countries where customer operates or has meaningful users · Structured list; not comma-separated text |
| **Operating States / Regions** | Multi-select fixed values · States/regions relevant to footprint or user distribution |
| **Reporting Region** | Derived enum: `APAC`, `EMEA`, `North America`, `LATAM` · System-derived; does not replace Country or State |

---

## 3. Customer Classification

| Data Point | Details |
|---|---|
| **Segment** | Fixed enum: `Enterprise`, `Mid-Market`, `SMB` · Data Dictionary controlled |
| **Customer Type** | Fixed enum: `Direct Customer`, `Partner`, `Reseller`, `Prospect`, `Former Customer` |
| **Lifecycle Stage** | Fixed enum: `Onboarding`, `Active / Adoption`, `Renewal`, `Churned`, `Reactivation` · Separate from Health and Risk |
| **Account Tier** | Fixed enum: `Tier 1`, `Tier 2`, `Tier 3` · Configurable |
| **Strategic Account** | Boolean · `True / False` · High-touch strategic treatment flag |
| **Industry** | Fixed enum: `SaaS`, `Financial Services`, `Healthcare`, `Education`, `Retail`, `Manufacturing`, `Professional Services`, `Media`, `Telecom`, `Government`, `Nonprofit`, `Other` |
| **Company Size** | Fixed enum (ranges): `1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1001-5000`, `5001-10000`, `10000+` |

---

## 4. Health and Risk

| Data Point | Details |
|---|---|
| **Health Status** | Fixed enum: `Healthy`, `Neutral`, `At Risk`, `Critical` · Initial human assessment · Review cadence: weekly (high-risk) / monthly (normal) |
| **Risk Level** | Fixed enum: `Low`, `Medium`, `High`, `Critical` · Independent from Health Status |
| **Risk Reasons** | Multi-select: `Low Adoption`, `Support Issues`, `Champion Loss`, `Budget Risk`, `Competition`, `Renewal Risk`, `Relationship Risk`, `Product Gap`, `Other` |
| **Health Notes** | Long free text · Context behind health/risk assessment |
| **Health Score** | Number `0–100` · Do not imply false precision before scoring model exists |

---

## 5. Ownership

| Data Point | Details |
|---|---|
| **Primary CSM** | User reference (UUID) · Internal person accountable for the Account |
| **CSM Team** | Team reference / fixed enum · Team responsible for the Account |
| **Account Manager / AE** | User reference (UUID) · Commercial relationship owner · Optional |
| **CSM Start Date** | Date · Date current CSM took ownership · Supports ownership analytics |

---

## 6. Commercial and Contract

| Data Point | Details |
|---|---|
| **Contract Start Date** | Date · Start of current agreement |
| **Contract End Date** | Date · End of current agreement · Renewal planning |
| **Renewal Date** | Date · Expected renewal decision/action date · May differ from end date |
| **Contract Value / ARR** | Decimal + currency · Annualized commercial value · Numeric storage, not free text |
| **Billing Currency** | Fixed enum: `USD`, `EUR`, `GBP`, `INR` · Prefer standard ISO codes |
| **Plan / Product Tier** | Fixed enum / product reference: `Basic`, `Pro`, `Enterprise` · Prefer product references when catalog exists |

---

## 7. Customer Context

| Data Point | Details |
|---|---|
| **Primary Customer Goal** | Long free text · Main outcome the customer wants |
| **Use Cases** | Multi-select: `Analytics`, `Automation`, `Reporting`, `Integrations`, `Collaboration`, `Compliance`, `Onboarding`, `Support`, `Other` · Controlled values preferred |
| **Success Criteria** | Long free text · How the customer defines success · Can later become structured goals |
| **Key Products / Modules** | Multi-select entity references · Products/modules purchased or in scope |

---

## 8. Lifecycle and Review Freshness

| Data Point | Details |
|---|---|
| **Customer Since** | Date · Start of customer relationship · Historical relationship date |
| **Onboarding Start Date** | Date · Date onboarding began |
| **Go-Live Date** | Date · Date customer became live |
| **Last CSM Review Date** | Timestamp (System) · Most recent review of judgement-based Account data · Detects stale health/risk data |
| **Next Review Date** | Date · Next planned review · Supports follow-up workflows |

---

## 9. System Metadata

| Data Point | Required | Details |
|---|---|---|
| **Created At** | System | Timestamp · Record creation time · Audit metadata |
| **Created By** | System | User reference · User who created the Account |
| **Updated At** | System | Timestamp · Latest Account update time |
| **Updated By** | System | User reference · User who last modified the Account |
| **Record Status** | System | Fixed enum: `Active`, `Archived` · Prefer archive over hard delete |
| **Data Source** | System | Fixed enum: `Manual`, `CRM Import`, `Migration`, `API` |

---

## 10. Field Type Definitions

| Field Type | Meaning / Why It Is Used | Example |
|---|---|---|
| Free text | Human-entered value with no dependable fixed vocabulary | Account Name |
| Long free text | Narrative content that needs explanation | Health Notes |
| Number | Numeric value used for calculation/comparison | Health Score = 82 |
| Decimal + currency | Money stored as numeric amount plus explicit currency | ARR = 50000.00 USD |
| Date | Calendar day when time-of-day is not meaningful | Renewal Date |
| Timestamp | Date + time + timezone when freshness/order matters | Last CSM Review |
| Boolean | Two-state value | Strategic Account = true |
| Fixed enum | One approved Data Dictionary value | Segment = Enterprise |
| Multi-select fixed values | Several approved values can apply | Operating States = Kerala, Karnataka |
| Dependent enum | Choices depend on another field | State depends on Country |
| User reference | Points to an internal user record | Primary CSM |
| Entity reference | Points to another business entity | Key Product |
| URL | Validated web address | https://acme.com |
| Domain | Normalised domain for matching | acme.com |

---

## 11. How Account Creation Joins the Other Module 1 Features

Account Creation is the **root feature** of Manual Data Intake. It creates the Account ID. Every other feature in Module 1 references that ID instead of creating another customer record.

---

## 12. Relationship Model

- **Account** is the parent entity and owns the Account ID.
- **Contacts** reference Account ID; each Contact belongs to one Account in the MVP.
- **Activities** reference Account ID and can optionally reference Contact ID when the interaction involves a specific person.
- **Tasks** reference Account ID and can optionally reference Contact ID when the follow-up concerns a specific person.
- **Account 360** later aggregates the Account plus Contacts, Activities, Tasks and additional entities by Account ID.

---

## 13. Example End-to-End Flow

1. CSM creates **Acme Technologies** → system generates Account ID `A100`.
2. CSM adds **John Smith** → Contact stores Account ID `A100`.
3. CSM records a **customer call** → Activity stores Account ID `A100` and optionally John's Contact ID.
4. CSM creates a **follow-up** → Task stores Account ID `A100` and optionally John's Contact ID.
5. **Account 360** queries `A100` and assembles the customer profile, Contacts, Activities and Tasks.

---

## 14. Cross-Feature Rules

- **Never use Account Name as the relational key.** All Module 1 child data must reference Account ID.
- Updating Account Name must automatically update its display everywhere without changing child records.
- Archiving an Account should preserve historical Contacts, Activities and Tasks according to the product retention policy.

| Feature | Relationship to Account | Key Link |
|---|---|---|
| Feature 1 – Account Creation | Creates the parent customer entity | Account ID |
| Feature 2 – Account Editing & Updates | Reads and updates the same Account record | Account ID |
| Feature 3 – Contact Management | Creates people attached to an Account | Contact.Account ID |
| Feature 4 – Activity Management | Creates interactions/events against an Account; optionally against a Contact | Activity.Account ID + optional Contact ID |
| Feature 5 – Task Management | Creates follow-up work against an Account; optionally against a Contact | Task.Account ID + optional Contact ID |

- Primary CSM on Account should be available to Task ownership and future workflow rules.
- Health Status and Risk Level are current-state Account values; Activities/reviews provide historical context.
- Child features should not duplicate Account identity fields unnecessarily.

---

## 15. Recommended Module 1 Architecture

| Entity | Primary Identifier | References | Purpose |
|---|---|---|---|
| Account | Account ID | Owner / User / Team references | Master customer record |
| Contact | Contact ID | Account ID | Customer people |
| Activity | Activity ID | Account ID, optional Contact ID | Interactions / events |
| Task | Task ID | Account ID, optional Contact ID | Follow-up work |
| Data Dictionary | Dictionary key | Field / config references | Controlled values |

---

## 16. Development Checklist

- [ ] Every Account field has explicit type, meaning, stored representation, source and cadence
- [ ] Data Dictionary owns fixed, multi-select and dependent values
- [ ] Country → State/Province dependency is supported
- [ ] Multi-value geography is stored structurally
- [ ] External Source + External Account ID are modelled together
- [ ] Account ID is the relational key for all Module 1 child features
- [ ] Contact, Activity and Task records reference Account ID
- [ ] Account 360 can aggregate Module 1 records by Account ID
- [ ] Audit metadata is system-generated
- [ ] Account archive behaviour preserves customer history
