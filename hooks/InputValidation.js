export function emailCheck(values) {
        const emailRegex =
            /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!emailRegex.test(values)) {
            return false;
        } else {

            return true;
        }
    }

    export function pwdCheck(values) {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!passwordRegex.test(values)) {
            return false;
        } else {
            return true;
        }
    }

    export function onlyNumber(values){
        const numberRegex =
            /[^0-9]/g;
        values.replace(numberRegex, "");
    }
