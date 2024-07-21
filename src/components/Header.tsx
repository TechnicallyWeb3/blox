import React from 'react'
import {
    DynamicWidget
} from "@dynamic-labs/sdk-react-core";
import Link from 'next/link';
import Image from "next/image";


export const Header = () => {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-left py-3 md:py-10">
                <Link href="/">
                    <Image
                        src="/blox400.jpg" // Path to your image in the public folder
                        alt="Site Logo"
                        width={100} // Adjust width as needed
                        height={100} // Adjust height as needed
                        priority={true} // Optional: prioritize loading of this image
                    />
                </Link>
            </div>
            <div className="flex items-center justify-right py-3 md:py-10">
                <DynamicWidget buttonClassName="text-white bg-red" />
            </div>
        </div>
    )
}
