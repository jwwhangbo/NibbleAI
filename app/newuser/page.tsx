import Link from "next/link";

export default function NewUserPage() {
    return (
        <>
            <span>welcome new user!</span>
            <Link className="text-blue-700" href='/newuser/questionnaire'>continue</Link>
        </>
    ); 
}