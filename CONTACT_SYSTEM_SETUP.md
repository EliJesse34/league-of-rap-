# Contact Management System - Setup & Deployment Guide

## Quick Start

### 1. Database Migration

Apply the migration to your Supabase instance:

```bash
# If using Supabase CLI
supabase db push

# Otherwise, manually run the SQL from:
supabase/migrations/20260601000000_add_contact_management.sql
```

The migration creates:
- `contact_settings` table (stores main contact info)
- `contact_social_links` table (pre-populated with 7 platforms)
- `contact_submissions` table (stores form messages)

### 2. Verify Database Setup

After migration, verify in Supabase dashboard:

1. Check `contact_settings` table exists
2. Check `contact_social_links` has 7 rows (one per platform)
3. Check `contact_submissions` table exists with correct columns

### 3. Initial Setup

1. Go to `/producer/contact-settings` (you must be logged in as admin)
2. Fill in your contact information:
   - Contact Name (required)
   - Contact Email (required)
   - Phone (optional)
   - Description/Bio (optional)
   - Location (optional)
   - Google Maps URL (optional)
3. Add social media URLs:
   - Enable/disable each platform
   - Add the full URL to each profile you want to display
4. Click "Save Settings"

### 4. Verify Frontend

1. Visit `/contact` to see the contact page
2. Verify all information displays correctly
3. Test the contact form
4. Check sidebar for "CONTACT" section on any page

## Files Created

### Database
- `supabase/migrations/20260601000000_add_contact_management.sql`

### Components
- `src/components/lor/ContactSection.tsx` - Sidebar widget
- `src/components/lor/ContactForm.tsx` - Form component

### Routes/Pages
- `src/routes/contact.tsx` - Public contact page
- `src/routes/producer.contact-settings.tsx` - Admin settings
- `src/routes/producer.contact-submissions.tsx` - Admin submissions

### Modified Files
- `src/components/lor/RightSidebar.tsx` - Added ContactSection
- `src/routes/producer.dashboard.tsx` - Added admin links

## Admin Access

Currently, admin access is determined by email:
- Must be: `@leagueofrap.com` domain OR `admin@leagueofrap.com`

**To change admin detection**, edit these files:
- `src/routes/producer.contact-settings.tsx` (line 21)
- `src/routes/producer.contact-submissions.tsx` (line 38)

Look for:
```typescript
const isAdmin = user?.email?.endsWith("@leagueofrap.com") || user?.email === "admin@leagueofrap.com";
```

## Form Submission Flow

1. User fills form on `/contact`
2. Honeypot field validates (empty)
3. Email format validated
4. Message length checked (min 10 chars)
5. Data sent to `contact_submissions` table
6. Success message shown
7. Admin notified (not implemented - add webhook if needed)

## Admin Features

### Contact Settings Page
- Edit all contact information
- Toggle social platforms on/off
- Update social media URLs
- Real-time validation
- Save status feedback

### Contact Submissions Page
- View all messages (newest first)
- Search by name, email, subject, message
- Mark messages as read/unread
- View full message details
- Reply via email (opens email client)
- Delete messages
- Export to CSV

## Email Notifications (Optional Setup)

To send email notifications when submissions arrive:

1. Set up Supabase Edge Functions or Webhooks
2. Trigger on `contact_submissions` INSERT
3. Send email to contact_email with submission details

Example webhook URL pattern:
```
POST /functions/v1/contact-notification
Body: { submission: { full_name, email, subject, message } }
```

## Dark Mode & Styling

All components use the existing League of Rap theme:
- Dark-first design
- Black/Red/White colors
- Responsive layout
- Mobile-optimized

No additional CSS required - uses existing Tailwind setup.

## Testing

### Test Scenarios

1. **Contact Form Submission**
   - Submit with all fields
   - Check success message
   - Verify in admin panel

2. **Admin Settings**
   - Edit contact info
   - Save changes
   - Verify on contact page

3. **Social Links**
   - Add URLs
   - Toggle on/off
   - Verify display order

4. **Admin Submissions**
   - Mark as read
   - Search messages
   - Export CSV
   - Delete submission

5. **Mobile Responsive**
   - Test on mobile devices
   - Check form usability
   - Verify social icons display

## Troubleshooting

### Contact Section Not Showing
- Check if `contact_settings` has data
- Verify enabled social links have URLs
- Check browser console for errors

### Admin Pages Not Accessible
- Verify logged-in user email
- Check admin email criteria
- Clear browser cache

### Form Submissions Not Appearing
- Check database connection
- Verify `contact_submissions` table exists
- Check RLS policies (all should allow public INSERT)
- Check browser console for errors

### Maps Not Displaying
- Ensure google_maps_url is filled in
- Use valid Google Maps embed URL format
- Test URL directly in browser

## Production Checklist

- [ ] Database migration applied
- [ ] Admin email configured
- [ ] Initial contact info added
- [ ] Social media URLs configured
- [ ] Email notifications setup (optional)
- [ ] Rate limiting configured (optional)
- [ ] Backup strategy in place
- [ ] Tested on production domain
- [ ] SSL/HTTPS verified
- [ ] SEO tags configured

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection
3. Check RLS policies
4. Review migration SQL
5. Check admin email configuration

## Version Notes

- Created: June 2026
- React/TanStack version: See package.json
- Supabase version: ^2.105.4
- Tailwind CSS: Latest with custom theme
