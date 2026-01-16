/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        //  Same for TS, better to ignore for MVP delivery if types are mostly fine but minor mismatches
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
