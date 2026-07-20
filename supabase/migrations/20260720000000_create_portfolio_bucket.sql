-- Crée le bucket "portfolio" s'il n'existe pas
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Politique pour autoriser la lecture publique
create policy "Lecture publique portfolio"
on storage.objects for select
using ( bucket_id = 'portfolio' );

-- Politique pour autoriser l'admin à insérer/modifier/supprimer
create policy "Admin modifie portfolio"
on storage.objects for all
using ( 
  bucket_id = 'portfolio' 
  and auth.uid() in (select id from public.profiles where role = 'admin') 
)
with check (
  bucket_id = 'portfolio' 
  and auth.uid() in (select id from public.profiles where role = 'admin') 
);
