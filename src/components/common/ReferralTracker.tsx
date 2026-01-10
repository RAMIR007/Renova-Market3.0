'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Cookies from 'js-cookie';

function Tracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            // Save referral code in cookie for 30 days
            Cookies.set('referral_code', ref, { expires: 30 });
        }
    }, [searchParams]);

    return null;
}

export default function ReferralTracker() {
    return (
        <Suspense fallback={null}>
            <Tracker />
        </Suspense>
    );
}
