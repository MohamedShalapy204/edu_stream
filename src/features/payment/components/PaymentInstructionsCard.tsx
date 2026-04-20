import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineDocumentDuplicate, HiOutlineCheck } from 'react-icons/hi2';

interface PaymentInstructionsCardProps {
    vodafoneNumber: string;
    amount: number;
}

const PaymentInstructionsCard: React.FC<PaymentInstructionsCardProps> = ({ vodafoneNumber, amount }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(vodafoneNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-surface-50 rounded-4xl p-6 md:p-8 space-y-8 border border-muted/10 shadow-inner">
            <h3 className="text-xl font-black tracking-tight text-foreground flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                {t('payment.instructions.title')}
            </h3>

            <div className="space-y-6">
                <div className="flex gap-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0 group-hover:scale-110 transition-transform shadow-sm">1</div>
                    <div className="pt-1">
                        <p className="font-bold text-foreground text-sm uppercase tracking-wide">{t('payment.instructions.step1Title')}</p>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                            {t('payment.instructions.step1Desc', { amount: `$${amount.toFixed(2)}` })}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="px-5 py-3 bg-white rounded-xl border border-muted/20 font-mono text-base tracking-widest font-bold shadow-sm">
                                {vodafoneNumber}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-3 bg-white rounded-xl border border-muted/20 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all shadow-sm active:scale-95"
                                title={t('payment.instructions.copyNumber')}
                            >
                                {copied ? <HiOutlineCheck className="w-5 h-5 text-success" /> : <HiOutlineDocumentDuplicate className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0 group-hover:scale-110 transition-transform shadow-sm">2</div>
                    <div className="pt-1">
                        <p className="font-bold text-foreground text-sm uppercase tracking-wide">{t('payment.instructions.step2Title')}</p>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                            {t('payment.instructions.step2Desc')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0 group-hover:scale-110 transition-transform shadow-sm">3</div>
                    <div className="pt-1">
                        <p className="font-bold text-foreground text-sm uppercase tracking-wide">{t('payment.instructions.step3Title')}</p>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                            {t('payment.instructions.step3Desc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentInstructionsCard;
