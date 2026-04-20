import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineUserCircle, HiOutlineCheckBadge, HiOutlineBanknotes } from 'react-icons/hi2';
import { useCurrentUser, useUpdateUser } from '@/hooks/useUser';
import { UserRole } from '@/features/auth';
import { VodafoneNumberInput, paymentSettingsSchema } from '@/features/payment';
import { toast } from 'react-hot-toast';

type ProfileSettingsInput = z.infer<typeof paymentSettingsSchema>;

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const { data: profile, isLoading } = useCurrentUser();
    const { mutate: updateProfile, isPending } = useUpdateUser();

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileSettingsInput>({
        resolver: zodResolver(paymentSettingsSchema) as Resolver<ProfileSettingsInput>,
        values: {
            vodafone_cash_number: profile?.vodafone_cash_number || '',
            save_as_default: true,
        }
    });

    const onUpdateProfile = (data: ProfileSettingsInput) => {
        if (!profile?.$id) return;

        updateProfile({
            userId: profile.$id,
            data: {
                vodafone_cash_number: data.vodafone_cash_number,
            }
        }, {
            onSuccess: () => {
                toast.success(t('profile.updateSuccess'));
            },
            onError: (error: Error) => {
                toast.error(error.message || t('profile.updateFailed'));
            }
        });
    };

    if (isLoading) return <div className="animate-pulse flex flex-col items-center justify-center p-20"><div className="w-20 h-20 bg-primary/10 rounded-full mb-4" /></div>;

    const isTeacher = profile?.role === UserRole.TEACHER;

    return (
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-base-100 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-premium">
                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl">
                        {profile?.name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase()}
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter">{profile?.name}</h2>
                        <div className="flex items-center self-center md:self-auto gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
                            <HiOutlineCheckBadge className="w-4 h-4 text-primary" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary">
                                {t('profile.scholarRole', { role: profile?.role })}
                            </span>
                        </div>
                    </div>
                    <p className="text-base-content/60 font-medium max-w-md text-sm md:text-base">{profile?.bio || t('profile.noBio')}</p>
                </div>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSubmit(onUpdateProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6 md:space-y-8 bg-base-100 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-premium">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <HiOutlineUserCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">{t('profile.identityDetails')}</h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/60 ml-1">{t('profile.scholarlyEmail')}</label>
                        <div className="input input-bordered h-14 rounded-2xl bg-base-200 border-none flex items-center px-6 font-semibold opacity-50 cursor-not-allowed text-sm">
                            {profile?.email}
                        </div>
                    </div>
                </div>

                {isTeacher && (
                    <div className="space-y-6 md:space-y-8 bg-base-100 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-premium">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <HiOutlineBanknotes className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">{t('profile.financialProtocol')}</h3>
                        </div>

                        <VodafoneNumberInput
                            label={t('profile.defaultNumberLabel')}
                            register={register('vodafone_cash_number')}
                            error={errors.vodafone_cash_number}
                            description={t('profile.defaultNumberDesc')}
                        />

                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn btn-primary w-full h-14 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all no-animation border-none"
                        >
                            {isPending ? <span className="loading loading-spinner" /> : t('profile.commitChanges')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
