import React from "react";
import UnsplashComponent from "./unsplash.jsx";

/**
 * Represents the URL of the logo image for Travel Mate.
 * This URL points to a resource hosted on Firebase Storage.
 *
 * Example format:
 * https://firebasestorage.googleapis.com/v0/b/bucket-name/o/object-name?alt=media&token=unique-token
 *
 * Use this variable to fetch or display the application's logo.
 * Ensure the URL is valid and accessible for proper functionality.
 */
const logoURL = "https://firebasestorage.googleapis.com/v0/b/travel-mate-sm07.firebasestorage.app/o/travel-mate-logo.svg?alt=media&token=43abb583-1320-4935-934d-a51d8f94f179";

/**
 * A layout component designed for authentication-related pages, providing flexible structure and styling for content.
 *
 * @param {Object} props - The component properties.
 * @param {React.ReactNode} props.children - The dynamic content rendered within the primary form section of the layout.
 *
 * The `AuthLayout` component consists of the following:
 * - A responsive container ensuring a minimum height for the screen.
 * - A grid-based structure dividing the layout into two sections for larger screens:
 *   1. The primary section for form content, dynamic components, and legal footer.
 *   2. A secondary section displaying an Unsplash image for additional visual emphasis (visible on larger screens).
 * - Includes a logo at the top, injected dynamic content (`children`), and a legal footer with links to Privacy Policy and Terms & Conditions.
 */
const AuthLayout = ({ children }) => {
    return (
        <div className={"min-h-screen mx-auto"}>
            <div className={"px-4 py-4"}>
                {/* GRID: form + (xl) photo */}
                <div className={"grid grid-flow-row grid-cols-1 xl:grid-cols-12 gap-6"}>

                    {/* LEFT: form (7/12 on xl)} */}
                    <div className={"xl:col-span-9 flex flex-col items-center"}>
                        <div className={"flex flex-col justify-center items-center min-w-full min-h-[90vh]"}>
                            <div className={"flex flex-col gap-6 items-center max-w-md lg:w-[500px]"}>
                                {/* Logo */}
                                <div className={"mb-2"}>
                                    <div className={"relative rounded-full"}>
                                        <img src={logoURL} className={"h-10 w-10"} />
                                    </div>
                                </div>

                                {/* DYNAMIC CONTENT INJECTED HERE */}
                                {children}
                            </div>
                        </div>

                        {/* LEGAL FOOTER */}
                        <div className={"mt-8 mb-8 flex items-center justify-center text-[7px] sm:text-[8px] lg:text-[12px] text-text-secondary w-full text-gray-500"}>
                            <span>&copy; 2025 Trevelo Inc. All Rights Reserved.</span>
                            <div className={"flex space-x-1"}>
                                <a href={"/privacy"} className={"hover:text-yellow-500 transition-colors"}>Privacy Policy</a>
                                <span>·</span>
                                <a href={"/terms"} className={"hover:text-yellow-500 transition-colors"}>Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Unsplash image (5/12 on xl) */}
                    <div className={"xl:col-span-3 hidden xl:block"}>
                        <div className={"h-[95vh] rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-2xl"}>
                            <div className={"h-full w-full"}>
                                <UnsplashComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;