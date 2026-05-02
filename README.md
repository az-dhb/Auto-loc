# Auto-Loc — Car Rental Platform

## Theme Mapping
- **Table A (Clients):** Managed via Supabase Auth — customers who rent cars
- **Table B (Cars):** The vehicles available for rent
- **Table C (Reservations):** Links clients to cars with dates and status
- **File:** Driver's licence photo uploaded on booking

## Architecture Analysis

### CAPEX vs OPEX
Using Vercel and Supabase eliminates CAPEX (buying servers, hardware, networking equipment). Instead we pay OPEX — small monthly usage fees only when the app is actually used. For a student project or startup, this means zero upfront investment.

### Scalability
Vercel uses a serverless edge network — it automatically scales to handle any number of users without manual configuration. A physical data center would require buying extra rack servers, cooling systems, and network infrastructure in advance. Vercel handles all of this transparently.

### Structured vs Non-Structured Data
- **Structured:** Cars table (brand, model, year, price), Reservations table (dates, status, foreign keys) — stored in PostgreSQL
- **Non-structured:** Car photos and driver licence images — stored in Supabase Storage as raw files
