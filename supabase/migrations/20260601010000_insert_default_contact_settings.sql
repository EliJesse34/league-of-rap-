-- Insert default contact settings
insert into public.contact_settings (contact_name, contact_email, contact_phone, contact_description)
values ('League of Rap', 'hello@leagueofrap.com', '2134086150', 'Contact us for inquiries, partnerships, and support.')
on conflict do nothing;
