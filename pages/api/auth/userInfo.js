
export default async function userInfo(req, res) {
    const {id} = req.body;
    try {
         const userInfo = await prisma.user.findUnique({
            where : {
                id : id
            },
            select : {
                email : true,
                name : true,
                image : true,
                size : true,
                email_receive : true,
                message_receive : true
            }
        });
        const emailLength = userInfo.email.split(/@/)[0].length;
        let secretEmail = '';
        for(let i = 0; i<emailLength-2; i++){
            secretEmail += '*';
        }
        if(userInfo.image === null){
            userInfo.image = '/images/mypage/defaultUser.png';
        }
        if(userInfo.name === null){
            userInfo.name = userInfo.email.split(/@/)[0];
        }
        userInfo.email = userInfo.email.substring(0,1) + secretEmail + userInfo.email.substring(emailLength-1, emailLength) + userInfo.email.substring(emailLength);
         return res.json(userInfo);
    }catch (error){
        console.log(error);
    }
}