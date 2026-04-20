import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Unauthorized() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-black text-error mb-2">403</h1>
            <p className="text-base-content/60 text-xl mb-6">{t('errors.unauthorized.p')}</p>
            <div className="flex gap-4">
                <Link to="/dashboard" className="btn btn-primary">{t('dashboard.student.actions')}</Link>
            </div>
        </div>
    );
}
