import React, { Fragment, useEffect, useState } from "react";
import { createApi } from "unsplash-js";

/**
 * The `unsplash` variable is an instance of the API client created using the `createApi` function.
 * It is configured with an access key for interacting with the Unsplash API.
 * The access key is securely retrieved from the environment variable `VITE_UNSPLASH_API_KEY`.
 *
 * This instance allows you to perform operations supported by the Unsplash API, such as fetching
 * images, searching for photos, and more.
 *
 * Note: Ensure that the `VITE_UNSPLASH_API_KEY` environment variable is defined with a valid Unsplash API key
 * before using this variable to avoid authentication issues.
 */
const unsplash = createApi({
    accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
});

/**
 * PhotoComp is a functional React component that renders a photo along with its attribution details.
 *
 * Props:
 * @param {Object} photo - The photo object containing metadata and image details.
 * @param {Object} photo.user - The user object containing data about the photographer.
 * @param {string} photo.user.username - The username of the photographer.
 * @param {Object} photo.urls - The object containing different URLs for the photo.
 * @param {string} photo.urls.regular - The URL for the regular-sized version of the photo.
 *
 * Description:
 * - Displays a photo with an inline attribution note below the image.
 * - Uses the `urls.regular` property for the photo source.
 * - Provides clickable links for the photographer’s Unsplash profile and Unsplash homepage.
 * - Handles accessibility by including an alt attribute for the image.
 */
const PhotoComp = ({ photo }) => {
    const { user, urls } = photo;

    return (
        <Fragment>
            <figure className={"flex flex-col h-full w-full overflow-hidden"}>
                <img className={"block h-full w-full object-cover"}
                     src={urls.regular}
                     alt={`Photo by ${user?.username || "photographer"} on Unsplash`}
                />
                <figcaption className={"px-4 py-3 text-center font-light text-[10px] text-white/70 text-shadow-xs text-shadow-neutral-500/20 tracking-wide"}>
                    (Photo by {" "}
                    <a className={"text-text-secondary hover:text-warning"} target={"_blank"} href={`https://unsplash.com/@${user.username}?utm_source=travel_mate&utm_medium=referral`}>
                        {user.username}
                    </a> {" "} on {" "}
                    <a className={"text-text-secondary hover:text-warning"} target={"_blank"} href={"https://unsplash.com?utm_source=travel_mate&utm_medium=referral"}>
                        Unsplash
                    </a>
                    )
                </figcaption>
            </figure>
        </Fragment>
    );
};

/**
 * UnsplashComponent is a React functional component that fetches a random photo
 * from the Unsplash API based on specific query parameters, and displays the photo
 * or relevant messages depending on the state of the fetched data.
 *
 * This component handles three main scenarios:
 * 1. While fetching data from the API, it displays a loading state with a skeleton UI.
 * 2. If there are errors in the API response or issues with accessing the token,
 *    it displays relevant error messages.
 * 3. Upon successfully fetching data, it displays the fetched photo using the PhotoComp component.
 *
 * Features:
 * - Uses the `useState` hook to manage the fetched photo data.
 * - Leverages the `useEffect` hook to perform the API request on component mount.
 * - Fetches one random photo with specific query tags and portrait orientation.
 */
const UnsplashComponent = () => {
    const [data, setPhotoResponse] = useState(null);

    useEffect(() => {
        unsplash.photos
            .getRandom({ query: 'travel, city, airplane, adventure, vacation, skyline', orientation: 'portrait', count: 1})
            .then((result) => {
                setPhotoResponse(result);
            })
            .catch(() => {
                console.error('Something went wrong!');
            });
    }, []);

    if (data === null) {
        return <div className={"rounded-md bg-muted animate-pulse max-w-xl min-h-screen"}></div>;
    } else if (data.errors) {
        return (
            <div>
                <div>{data.errors[0]}</div>
                <div>PS: Make sure to set your access token!</div>
            </div>
        );
    } else {
        return (
            <div className={"h-full w-full"}>
                <PhotoComp photo={data.response[0]} />
            </div>
        );
    }
};

export default UnsplashComponent;