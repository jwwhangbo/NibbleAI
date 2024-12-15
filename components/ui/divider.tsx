export default function Divider({className}: {className?: string}) {
    return(
        <div className={className}>
            <hr className={`w-full border-t-[2px] rounded-sm border-foreground`} />
            <span>or</span>
            <hr className={`w-full border-t-[2px] rounded-sm border-foreground`} />
        </div>
    );
}