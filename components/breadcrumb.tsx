"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BlogBreadcrumb({ title }: { title?: string }) {
    const pathname = usePathname()
    const paths = pathname.split('/').filter(path => path)

    const breadcrumbItems = paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`
        const isLastItem = index === paths.length - 1
        const label = isLastItem && title ? title : path.charAt(0).toUpperCase() + path.slice(1)

        return (
            <React.Fragment key={path}>
                <BreadcrumbItem>
                    {isLastItem ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={href}>
                                {label}
                            </Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
        )
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">
                            Home
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {paths.length > 0 && <BreadcrumbSeparator />}
                {breadcrumbItems}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
