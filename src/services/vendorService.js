import { auth, firestore } from '../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, deleteUser, signInWithEmailAndPassword  } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore"; 

export const registerVendor = async (vendorData) => {
    const { email, password, name } = vendorData; 

    const errorMessages = {
        "auth/email-already-in-use": "Email này đã được sử dụng. Vui lòng sử dụng email khác.",
        "auth/invalid-email": "Định dạng email không hợp lệ. Vui lòng kiểm tra lại.",
        "auth/weak-password": "Mật khẩu phải có ít nhất 6 ký tự.",
        "auth/network-request-failed": "Kết nối mạng bị lỗi. Vui lòng thử lại.",
        "auth/internal-error": "Đã xảy ra lỗi nội bộ. Vui lòng thử lại sau.",
        "auth/missing-password": "Bạn hãy nhập mật khẩu",
        "auth/email-not-verified": "Đăng kí thất bại do chưa xác thực email",
    };

    try {
        // Kiểm tra email có tồn tại trong Firestore không
        const vendorsRef = collection(firestore, "vendors");
        const snapshot = await getDocs(vendorsRef);
        const existingEmails = snapshot.docs.map(doc => doc.data().email);

        if (existingEmails.includes(email)) {
            throw { code: "auth/email-already-in-use", message: "Email này đã được sử dụng. Vui lòng sử dụng email khác." };
        }

        // Tạo tài khoản tạm thời trên Firebase Authentication
        const vendorCredential = await createUserWithEmailAndPassword(auth, email, password);
        const vendor = vendorCredential.user;
        const vendorId = vendor.uid;

        // Gửi email xác thực
        await sendEmailVerification(vendor);
        console.log("Đợi xác thực email...");

        // Chờ xác thực email (tối đa 60 giây)
        const maxWaitTime = 30000;
        let emailVerified = false;

        const checkVerification = async () => {
            await vendor.reload();
            emailVerified = vendor.emailVerified;
        };

        const waitForVerification = new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                await checkVerification();
                if (emailVerified) {
                    clearInterval(interval);
                    resolve();
                }
            }, 2000);

            setTimeout(() => {
                clearInterval(interval);
                reject(new Error("Thời gian xác thực email đã hết."));
            }, maxWaitTime);
        });

        try {
            await waitForVerification;
        } catch (error) {
            console.error("Người dùng chưa xác thực email:", error.message);
            
            // Xóa tài khoản nếu người dùng không xác thực email
            await deleteUser(vendor);
            throw {
                message: "Bạn chưa xác thực email. Tài khoản của bạn đã bị hủy.",
                code: "auth/email-not-verified",
            };
        }

        // Chỉ lưu tài khoản vào Firestore khi xác thực thành công
        const vendorRef = doc(firestore, "vendors", vendor.uid);
        await setDoc(vendorRef, {
            vendorId,
            name: name || "",
            email,
            createdAt: new Date().toISOString(),
            emailVerified: true,
            status: "pending",
        });

        return {
            status: 201,
            message: "Tài khoản đã được xác thực và thông tin đã được lưu thành công.",
            emailVerified: true,
        };

    } catch (error) {
        console.error("Firebase Error:", error.message);
        const customMessage = errorMessages[error.code] || "Xảy ra lỗi không xác định";
        throw {
            message: customMessage,
            code: error.code,
        };
    }
};

export const loginVendor = async (email, password) => {
    const errorMessages = {
        "auth/invalid-credential": "Email hoặc mật khẩu không chính xác.",
        "auth/user-not-found": "Tài khoản không tồn tại. Vui lòng đăng ký.",
        "auth/wrong-password": "Mật khẩu không đúng. Vui lòng thử lại.",
        "auth/too-many-requests": "Tài khoản tạm thời bị khóa do nhập sai nhiều lần. Vui lòng thử lại sau.",
        "auth/network-request-failed": "Lỗi kết nối. Vui lòng kiểm tra mạng của bạn.",
    };

    try {
        // Đăng nhập Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Lấy vendor từ Firestore theo `user.uid`
        const vendorsRef = collection(firestore, "vendors");
  const snapshot = await getDocs(vendorsRef);

        // Lọc vendor theo `email`, đồng thời lấy luôn `id` của document
const vendorDoc = snapshot.docs.find((doc) => doc.data().email === email);

        if (!vendorDoc) {
throw new Error("Tài khoản không tồn tại. Vui lòng đăng ký.");
        }

        // Lấy `vendorData` và `id`
        const vendorData = vendorDoc.data();
        const vendorId = vendorDoc.id; // Lấy ID từ Firestore
        // Kiểm tra trạng thái tài khoản
        if (vendorData.status === "pending") {
            return { navigateTo: "/pending" };
        } else if (vendorData.status === "active") {
            return {
                navigateTo: "/home",
                vendor: { id: vendorId, ...vendorData }, 
            };
        } else {
            throw new Error("Tài khoản của bạn chưa được kích hoạt.");
        }
    } catch (error) {
        const errorMessage = errorMessages[error.code] || "Đăng nhập thất bại. Vui lòng thử lại.";
        throw new Error(errorMessage);
    }
};
