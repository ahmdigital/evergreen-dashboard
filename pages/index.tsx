import { PageLoader } from "../components/PageLoader"


export async function getServerSideProps() {
    return {
        props: {
            targetOrganisation: process.env.NEXT_PUBLIC_TARGET_ORGANISATION,
        }
    }
}

export default function Profile(props: { targetOrganisation: string }) {
    return PageLoader("npm", props)
}
