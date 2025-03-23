export default function Divider({className}: {className?: string}) {
    return(
        <div className={className}>
            <hr className={`w-full border-t-[1px] rounded-sm border-gray-400`} />
            <span>or</span>
            <hr className={`w-full border-t-[1px] rounded-sm border-gray-400`} />
        </div>
    );
}