-- ALTER TABLE: campuri noi. Ruleaza o singura data.
-- D1 nu suporta IF NOT EXISTS la ADD COLUMN; daca o coloana exista deja,
-- comanda respectiva da eroare benigna — ignora si continua.
ALTER TABLE clients ADD COLUMN inquiry_count INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN last_subject TEXT DEFAULT '';
ALTER TABLE clients ADD COLUMN email_source TEXT DEFAULT '';
ALTER TABLE clients ADD COLUMN products_ordered TEXT DEFAULT '[]';
ALTER TABLE clients ADD COLUMN margin_class TEXT DEFAULT '';
