-- Add start_date, end_date, and show_dates to projects table
ALTER TABLE public.projects 
ADD COLUMN start_date date,
ADD COLUMN end_date date,
ADD COLUMN show_dates boolean DEFAULT true;
