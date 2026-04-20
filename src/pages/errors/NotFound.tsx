import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-black text-base-content mb-2">{t('errors.notFound.title')}</h1>
            <p className="text-base-content/60 text-xl mb-6">{t('errors.notFound.p')}</p>
            <Link to="/" className="btn btn-primary">{t('errors.notFound.returnHome')}</Link>
        </div>
    );
}
