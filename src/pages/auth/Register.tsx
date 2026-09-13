import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { authService } from '../../services/authService';
import { maternalService } from '../../services/maternalService';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  name: z.string().min(3, 'Nama lengkap wajib diisi'),
  dateOfBirth: z.string().min(1, 'Tanggal lahir wajib diisi'),
  phone: z.string().min(9, 'Nomor HP tidak valid'),
  email: z.string().email('Email tidak valid'),
  hpht: z.string().min(1, 'HPHT wajib diisi'),
  address: z.string().min(5, 'Alamat wajib diisi'),
  emergencyContactName: z.string().min(3, 'Nama pendamping wajib diisi'),
  emergencyContactPhone: z.string().min(9, 'Nomor kontak darurat tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  consent: z.literal(true, {
    error: 'Anda harus menyetujui pernyataan ini untuk melanjutkan',
  }),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { refresh, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { user } = authService.registerMother({ ...values });
    maternalService.createProfile({
      userId: user.id,
      name: values.name,
      dateOfBirth: values.dateOfBirth,
      phone: values.phone,
      address: values.address,
      hpht: values.hpht,
      emergencyContactName: values.emergencyContactName,
      emergencyContactPhone: values.emergencyContactPhone,
    });
    login(values.email, values.password);
    refresh();
    navigate('/ibu');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--color-deep-dark)]">e-SIGRA</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Daftar sebagai Ibu Hamil</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Field label="Nama lengkap" error={errors.name?.message}>
              <input {...register('name')} className={inputClass} />
            </Field>
            <Field label="Tanggal lahir" error={errors.dateOfBirth?.message}>
              <input type="date" {...register('dateOfBirth')} className={inputClass} />
            </Field>
            <Field label="Nomor HP" error={errors.phone?.message}>
              <input {...register('phone')} className={inputClass} placeholder="08xxxxxxxxxx" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input type="email" {...register('email')} className={inputClass} />
            </Field>
            <Field label="Tanggal Hari Pertama Haid Terakhir (HPHT)" error={errors.hpht?.message}>
              <input type="date" {...register('hpht')} className={inputClass} />
            </Field>
            <Field label="Alamat" error={errors.address?.message}>
              <textarea {...register('address')} rows={2} className={inputClass} />
            </Field>
            <Field label="Nama pendamping / keluarga" error={errors.emergencyContactName?.message}>
              <input {...register('emergencyContactName')} className={inputClass} />
            </Field>
            <Field label="Nomor kontak darurat" error={errors.emergencyContactPhone?.message}>
              <input {...register('emergencyContactPhone')} className={inputClass} placeholder="08xxxxxxxxxx" />
            </Field>
            <Field label="Kata sandi" error={errors.password?.message}>
              <input type="password" {...register('password')} className={inputClass} />
            </Field>

            <label className="flex items-start gap-2.5 pt-1 text-xs text-[var(--color-ink)]/70">
              <input type="checkbox" {...register('consent')} className="mt-0.5 h-4 w-4 shrink-0" />
              Saya memahami bahwa e-SIGRA merupakan alat bantu skrining dan edukasi, bukan pengganti
              pemeriksaan tenaga kesehatan.
            </label>
            {errors.consent && <p className="text-xs text-[var(--color-red)]">{errors.consent.message}</p>}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              Daftar
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--color-ink)]/60">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-[var(--color-deep)]">
              Masuk
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]';

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[var(--color-red)]">{error}</p>}
    </div>
  );
}
