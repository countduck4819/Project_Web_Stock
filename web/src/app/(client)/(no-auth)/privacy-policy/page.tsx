export default function PrivacyPolicy() {
    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-16 px-4">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-10 border border-gray-100">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Chính sách Quyền riêng tư
                </h1>

                <div className="space-y-5 text-gray-700 leading-relaxed">
                    <p>
                        <strong>Chúng tôi thu thập:</strong> tên{" "}
                        <b>Vũ Thành Khang</b>, email{" "}
                        <a
                            href="mailto:17loiten@gmail.com"
                            className="text-blue-600 hover:underline"
                        >
                            17loiten@gmail.com
                        </a>
                        .
                    </p>

                    <p>
                        <strong>Mục đích:</strong> xác thực người dùng, chăm sóc
                        khách hàng, và cải thiện chất lượng dịch vụ.
                    </p>

                    <p>
                        <strong>Lưu trữ & chia sẻ:</strong> dữ liệu được lưu trữ
                        an toàn trên máy chủ của chúng tôi; chúng tôi{" "}
                        <b>không chia sẻ</b> thông tin cá nhân của bạn cho bên
                        thứ ba.
                    </p>

                    <p>
                        <strong>Quyền của bạn:</strong> bạn có thể yêu cầu xem,
                        sửa, hoặc xóa dữ liệu cá nhân của mình bằng cách gửi
                        email đến:{" "}
                        <a
                            href="mailto:17loiten@gmail.com"
                            className="text-blue-600 hover:underline"
                        >
                            17loiten@gmail.com
                        </a>
                    </p>

                    <p>
                        <strong>Cookie:</strong> chúng tôi sử dụng cookie
                        HTTP-only để đảm bảo an toàn trong quá trình đăng nhập.
                    </p>

                    <p>
                        <strong>Liên hệ:</strong> Nhà 21, ngõ 44, phố Đại Linh,
                        Trung Văn, Hà Nội. <br />
                        Email:{" "}
                        <a
                            href="mailto:17loiten@gmail.com"
                            className="text-blue-600 hover:underline"
                        >
                            17loiten@gmail.com
                        </a>
                    </p>

                    <p className="text-sm text-gray-500 border-t pt-4 mt-6">
                        <em>Cập nhật lần cuối: 22/10/2025</em>
                    </p>
                </div>
            </div>
        </section>
    );
}
