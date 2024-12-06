import React, { useEffect, useState } from 'react'

interface LazyImageProps {
    url: string;
    alt: string;
}

const LazyImage = ({ url, alt }: LazyImageProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [opacity, setOpacity] = useState<string>('opacity-0');

    useEffect(() => {
        isLoading ? setOpacity('opacity-0') : setOpacity('opacity-100');
    }, [isLoading])

    return (
        <>
            {isLoading && (
                <div className='absolute h-full  z-10 w-full flex items-center justify-center'>
                    ...loading
                </div>
            )}
            <img
                src={url}
                alt={alt}
                width="100%"
                height="auto"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                className={`object-contain h-full ${opacity}`}
            />
        </>

    )
}

export default LazyImage