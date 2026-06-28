-- ============================================================
-- ProRasyon — Supabase SQL Şeması
-- Supabase Dashboard > SQL Editor > New Query > Yapıştır > Run
-- ============================================================

-- 1. Profiller (Auth users ile bağlantılı)
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT,
  full_name       TEXT,
  company_name    TEXT,
  role            TEXT DEFAULT 'user' CHECK (role IN ('user','admin')),
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free','trial','pro')),
  plan_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Profil otomatik oluşturma trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Çiftlikler
CREATE TABLE IF NOT EXISTS farms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Çiftlik 1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Gruplar
CREATE TABLE IF NOT EXISTS groups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id    UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Grup 1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Grup verileri (rasyon, parametreler)
CREATE TABLE IF NOT EXISTS group_data (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id              UUID UNIQUE NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  selected_period       TEXT DEFAULT 'starter',
  start_date            DATE,
  animal_count          INTEGER DEFAULT 100,
  avg_weight            NUMERIC DEFAULT 300,
  winter_mode           BOOLEAN DEFAULT FALSE,
  dm_rate               NUMERIC DEFAULT 2.2,
  feed_items            JSONB DEFAULT '[]',
  period_shares         JSONB DEFAULT '{}',
  purchase_weight       NUMERIC DEFAULT 300,
  purchase_price        NUMERIC DEFAULT 260,
  final_weight          NUMERIC DEFAULT 600,
  carcass_yield         NUMERIC DEFAULT 58,
  carcass_price         NUMERIC DEFAULT 430,
  analysis_animal_count INTEGER DEFAULT 100,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tartım kayıtları
CREATE TABLE IF NOT EXISTS weighings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  avg_weight NUMERIC NOT NULL,
  daily_feed NUMERIC DEFAULT 0,
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gider defteri (çiftlik bazlı)
CREATE TABLE IF NOT EXISTS expenses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id    UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  months     JSONB DEFAULT '[0,0,0,0,0,0,0,0]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) — Kullanıcı sadece kendi verisini görür
-- ============================================================

ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms     ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups    ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weighings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses  ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "profiles_admin_read" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Farms
CREATE POLICY "farms_own" ON farms
  FOR ALL USING (auth.uid() = user_id);

-- Groups (farm sahibi üzerinden)
CREATE POLICY "groups_own" ON groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = groups.farm_id AND farms.user_id = auth.uid())
  );

-- Group data
CREATE POLICY "group_data_own" ON group_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM groups
      JOIN farms ON farms.id = groups.farm_id
      WHERE groups.id = group_data.group_id AND farms.user_id = auth.uid()
    )
  );

-- Weighings
CREATE POLICY "weighings_own" ON weighings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM groups
      JOIN farms ON farms.id = groups.farm_id
      WHERE groups.id = weighings.group_id AND farms.user_id = auth.uid()
    )
  );

-- Expenses
CREATE POLICY "expenses_own" ON expenses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = expenses.farm_id AND farms.user_id = auth.uid())
  );

-- ============================================================
-- İndeksler (performans)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_farms_user       ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_farm      ON groups(farm_id);
CREATE INDEX IF NOT EXISTS idx_weighings_group  ON weighings(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_farm    ON expenses(farm_id);
CREATE INDEX IF NOT EXISTS idx_group_data_group ON group_data(group_id);
