import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"
import SignInForm from "./signinform"

function SignInDialog() {
    return (
        <Dialog>
            <DialogTrigger className={`text-[#0B4A53] font-semibold hover:text-[#0B4A53]/90 transition-colors hover:underline underline-offset-4`}>sign in</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle >Sign In</DialogTitle>
                    <DialogDescription>
                        Choose a provider to sign in
                    </DialogDescription>
                </DialogHeader>
                <SignInForm />
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog