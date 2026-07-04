# Contact Management System - Architecture & Code Reference

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Public Pages:                   Admin Pages:              │
│  ├─ /contact (ContactPage)      ├─ /producer/contact-settings
│  └─ RightSidebar                └─ /producer/contact-submissions
│     └─ ContactSection           
│                                 Components:
│  Components:                    ├─ ContactForm
│  └─ ContactForm                 └─ ContactSection
│     └─ Form validation
│
└─────────────────────────────────────────────────────────────┘
            ↓ Supabase Client (supabase-js)
┌─────────────────────────────────────────────────────────────┐
│                     Backend Layer (Supabase)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tables:                        Row Level Security:        │
│  ├─ contact_settings           ├─ Public read             │
│  ├─ contact_social_links       ├─ Admin write/update/del  │
│  └─ contact_submissions        └─ Public submissions      │
│                                                             │
│  Policies:                      Indexes:                   │
│  ├─ contact_settings_read_all  ├─ contact_social_links    │
│  ├─ contact_social_links_read  │  (platform, display_order)
│  ├─ contact_submissions_insert ├─ contact_submissions     │
│  └─ Admin-only updates         │  (email, created_at, etc)
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Header
├── SecondaryNav
├── Main Content
│   ├── PublicPages
│   │   ├── / (home)
│   │   ├── /contact (NEW)
│   │   │   ├── ContactForm (NEW)
│   │   │   └── SocialMediaSection
│   │   └── ...
│   └── AdminPages
│       ├── /producer/dashboard
│       │   └── AdminManagementSection (UPDATED)
│       ├── /producer/contact-settings (NEW)
│       │   └── ContactSettingsForm
│       ├── /producer/contact-submissions (NEW)
│       │   ├── SubmissionsTable
│       │   ├── DetailsDialog
│       │   └── DeleteConfirmDialog
│       └── ...
├── RightSidebar (UPDATED)
│   ├── TrendingVideos
│   ├── Categories
│   ├── Subscription
│   └── ContactSection (NEW)
├── Footer
└── MobileBottomNav
```

---

## Data Flow Diagrams

### 1. Contact Form Submission Flow

```
User fills form
        ↓
Form validation
        ↓
Honeypot check
        ↓
Email validation
        ↓
Message length check (min 10 chars)
        ↓
Submit to Supabase
        ↓
Insert into contact_submissions
        ↓
Show success message
        ↓
Clear form
```

### 2. Admin Settings Update Flow

```
Admin logged in
        ↓
Navigate to /producer/contact-settings
        ↓
Fetch contact_settings & contact_social_links
        ↓
Display in form
        ↓
Admin edits fields
        ↓
Click Save
        ↓
Update Supabase tables
        ↓
Show success message
        ↓
Changes live on /contact page
```

### 3. Contact Display Flow

```
Page loads
        ↓
Fetch contact_settings
        ↓
Fetch enabled contact_social_links
        ↓
Render ContactSection
        ↓
Display name, email, phone, description
        ↓
Render social media icons
        ↓
User can click icons or email/phone
```

---

## API/Database Queries

### Queries Used

```typescript
// Fetch contact settings
supabase.from("contact_settings").select("*").single()

// Fetch social links
supabase.from("contact_social_links")
  .select("*")
  .eq("is_enabled", true)
  .order("display_order", { ascending: true })

// Insert submission
supabase.from("contact_submissions").insert([{ ... }])

// Fetch submissions
supabase.from("contact_submissions")
  .select("*")
  .eq("is_spam", false)
  .order("created_at", { ascending: false })

// Update submission read status
supabase.from("contact_submissions")
  .update({ is_read: !isRead })
  .eq("id", id)

// Delete submission
supabase.from("contact_submissions").delete().eq("id", id)
```

---

## File Organization

```
src/
├── components/
│   └── lor/
│       ├── ContactSection.tsx (NEW)
│       ├── ContactForm.tsx (NEW)
│       ├── RightSidebar.tsx (UPDATED)
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ...
├── routes/
│   ├── contact.tsx (NEW)
│   ├── producer.contact-settings.tsx (NEW)
│   ├── producer.contact-submissions.tsx (NEW)
│   ├── producer.dashboard.tsx (UPDATED)
│   └── ...
├── hooks/
│   └── use-auth.tsx
├── integrations/
│   └── supabase/
│       └── client.ts
└── styles.css

supabase/
└── migrations/
    └── 20260601000000_add_contact_management.sql (NEW)
```

---

## Key Technologies Used

| Technology | Purpose |
|-----------|---------|
| React | UI library |
| TanStack Router | Routing |
| Supabase | Backend/Database |
| Tailwind CSS | Styling |
| TypeScript | Type safety |
| Lucide Icons | Icons |
| Radix UI | UI components |
| React Hook Form | Form handling |

---

## Validation Rules

### Contact Form Validation

```
Full Name:
  - Required
  - String type
  - No special length limit

Email:
  - Required
  - Valid email format (regex)
  - Tested with /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Subject:
  - Required
  - Non-empty after trim

Message:
  - Required
  - Minimum 10 characters
  - Non-empty after trim

Honeypot:
  - Must be empty
  - Hidden field for spam detection
```

### Admin Contact Settings Validation

```
Contact Name:
  - Required if saving

Contact Email:
  - Required if saving
  - Valid email format

Phone/Location/Description:
  - Optional

Google Maps URL:
  - Optional
  - Must be valid embed URL format
```

---

## Security Measures

### Row Level Security (RLS)

```sql
-- contact_settings
SELECT: true (anyone can read)
INSERT: admin only
UPDATE: admin only
DELETE: admin only

-- contact_social_links
SELECT: true (anyone can read)
INSERT: admin only
UPDATE: admin only
DELETE: admin only

-- contact_submissions
SELECT: admin only
INSERT: true (anyone can submit)
UPDATE: admin only
DELETE: admin only
```

### Frontend Security

```typescript
// Honeypot field
<input type="text" style={{ display: "none" }} />

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Message length check
if (message.length < 10) { reject }

// Input trimming
value.trim()

// XSS prevention through React
// (automatically escapes in JSX)
```

---

## Performance Optimizations

### Database Indexes

```sql
-- contact_social_links
INDEX ON (platform)
INDEX ON (display_order)

-- contact_submissions
INDEX ON (email)
INDEX ON (created_at DESC)
INDEX ON (is_read)
INDEX ON (is_spam)
```

### Frontend Optimizations

```typescript
// Load data once on component mount
useEffect(() => { fetchData() }, [])

// Filter data client-side (small dataset)
const filtered = submissions.filter(...)

// Debounce search (can be added)
// Pagination (can be added for large datasets)

// Lazy load images
<img loading="lazy" />
```

---

## Error Handling

### Form Submission Errors

```typescript
try {
  // Submit form
} catch (error) {
  setStatus("error")
  setErrorMessage("Failed to submit...")
  console.error(error)
}
```

### Data Fetching Errors

```typescript
const { data, error } = await supabase...
if (error && error.code !== "PGRST116") {
  console.error("Error:", error)
  // Handle error
}
```

---

## Environment Setup

### Required Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Optional Configuration

```typescript
// Admin emails (in code, can be moved to env)
const ADMIN_EMAILS = [
  "@leagueofrap.com",
  "admin@leagueofrap.com"
]
```

---

## Testing Recommendations

### Unit Tests

```typescript
// ContactForm validation
test("should validate email format", () => {})

// Date formatting
test("should format submission date correctly", () => {})

// CSV export
test("should generate valid CSV", () => {})
```

### Integration Tests

```typescript
// Form submission to database
test("should submit form and appear in admin panel", () => {})

// Admin update flow
test("should update contact settings and reflect on page", () => {})

// Search functionality
test("should filter submissions by search term", () => {})
```

### E2E Tests

```typescript
// Complete user journey
test("user can fill form, submit, and admin can view", () => {})

// Admin workflow
test("admin can update settings and see changes live", () => {})
```

---

## Monitoring & Logging

### Recommended Logging Points

```typescript
// Database errors
console.error("Error fetching contact data:", error)

// Form submission issues
console.error("Error submitting form:", error)

// Admin operations
console.log("Contact settings updated")
console.log("Submission deleted:", id)
```

### Analytics Events (To Add)

```typescript
// User interactions
trackEvent("contact_page_visited")
trackEvent("contact_form_submitted")
trackEvent("contact_form_failed")

// Admin activities
trackEvent("contact_settings_updated")
trackEvent("submission_marked_read")
trackEvent("csv_exported")
```

---

## Maintenance Tasks

### Regular Checks

- [ ] Monitor database storage
- [ ] Review spam submissions
- [ ] Check error logs
- [ ] Update social media links
- [ ] Backup submissions (CSV export)
- [ ] Test form submission monthly

### Periodic Updates

- [ ] Review and update contact info
- [ ] Check Google Maps embed still works
- [ ] Verify social media URLs
- [ ] Update admin email whitelist

---

## Deployment Checklist

- [ ] Database migration applied
- [ ] All files in correct locations
- [ ] No TypeScript errors
- [ ] Admin emails configured
- [ ] Contact info added
- [ ] Social links configured
- [ ] Test form submission
- [ ] Verify sidebar displays
- [ ] Test admin pages
- [ ] SSL/HTTPS configured
- [ ] SEO meta tags verified
- [ ] Mobile responsive tested

---

**Document Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Ready for Production ✅
