export function AuthDivider() {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white dark:bg-card px-2 text-muted-foreground">
          Or continue with
        </span>
            </div>
        </div>
    );
}