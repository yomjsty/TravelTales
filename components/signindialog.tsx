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
            <DialogTrigger className={`${buttonVariants({ variant: "secondary" })} tracking-wider`}>Login</DialogTrigger>
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