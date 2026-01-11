'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/actions/tracking';

function PageTrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

        // Track page view
        trackEvent('view', 'page', url);

    }, [pathname, searchParams]);

    return null;
}

export default function PageTracker() {
    return (
        <Suspense fallback={null}>
            <PageTrackerContent />
        </Suspense>
    );
}
