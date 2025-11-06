// "use client";

// import { useEffect, useState, useMemo } from "react";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import {
//     AlertDialog,
//     AlertDialogContent,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogCancel,
//     AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectItem,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import Image from "next/image";

// export interface CrudField {
//     name: string;
//     label: string;
//     type: "input" | "select" | "textarea" | "file" | "password";
//     options?: { label: string; value: string }[];
//     required?: boolean;
//     placeholder?: string;
//     // 🟣 cho phép validate phụ thuộc vào các field khác
//     validate?: (value: any, allValues?: Record<string, any>) => string | null;
// }

// interface CrudDialogProps<T> {
//     mode: "add" | "edit" | "delete" | null;
//     open: boolean;
//     onClose: () => void;
//     onSubmit: (data: Partial<T>, mode: "add" | "edit" | "delete") => void;
//     item?: T | null;
//     entityName?: string;
//     fields: CrudField[];
// }

// export function CrudDialog<T>({
//     mode,
//     open,
//     onClose,
//     onSubmit,
//     item,
//     entityName = "mục này",
//     fields,
// }: CrudDialogProps<T>) {
//     const [formData, setFormData] = useState<Partial<T>>({});
//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [imagePreview, setImagePreview] = useState<string | null>(null);

//     const isEditMode = mode === "edit";

//     const dynamicFields = useMemo(
//         () =>
//             fields.map((f) =>
//                 ["password", "confirmPassword"].includes(f.name)
//                     ? { ...f, required: !isEditMode }
//                     : f
//             ),
//         [fields, isEditMode]
//     );

//     useEffect(() => {
//         if (mode === "edit" && item) {
//             setFormData(item);
//             const avatarField = fields.find((f) => f.type === "file");
//             if (avatarField) {
//                 const avatarUrl = (item as any)[avatarField.name];
//                 if (avatarUrl) setImagePreview(avatarUrl);
//             }
//         } else if (mode === "add") {
//             setFormData({});
//             setImagePreview(null);
//         }
//     }, [mode, item, fields]);

//     const handleChange = (key: string, value: string) => {
//         setFormData((prev) => ({ ...prev, [key]: value }));
//         setErrors((prev) => ({ ...prev, [key]: "" }));
//     };

//     const handleFileChange = (key: string, file: File) => {
//         const previewUrl = URL.createObjectURL(file);
//         setImagePreview(previewUrl);
//         setFormData((prev) => ({ ...prev, [key]: file }));
//     };

//     // 🟣 validateForm hỗ trợ phụ thuộc field
//     const validateForm = () => {
//         const newErrors: Record<string, string> = {};

//         dynamicFields.forEach((f) => {
//             const value = (formData as any)[f.name];

//             // Kiểm tra required
//             if (f.required && (value === undefined || value === "")) {
//                 newErrors[f.name] = `${f.label} là bắt buộc`;
//             }

//             // Kiểm tra custom validate (có thể phụ thuộc field khác)
//             if (f.validate) {
//                 const msg = f.validate(value, formData as any);
//                 if (msg) newErrors[f.name] = msg;
//             }
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     if (mode === "add" || mode === "edit") {
//         return (
//             <Dialog open={open} onOpenChange={onClose}>
//                 <DialogContent
//                     className="bg-gradient-to-br from-[#1A1034] via-[#21173F] to-[#2A1B47]
//                     border border-purple-600/30 shadow-xl shadow-purple-900/30
//                     text-gray-100 max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6"
//                 >
//                     <DialogHeader>
//                         <DialogTitle className="text-lg font-semibold text-white">
//                             {isEditMode
//                                 ? `Chỉnh sửa ${entityName}`
//                                 : `Thêm ${entityName} mới`}
//                         </DialogTitle>
//                         <DialogDescription className="text-gray-400">
//                             {isEditMode
//                                 ? `Cập nhật thông tin ${entityName} đã chọn.`
//                                 : `Điền thông tin ${entityName} mới vào form bên dưới.`}
//                         </DialogDescription>
//                     </DialogHeader>

//                     <div className="space-y-4 py-3">
//                         {dynamicFields.map((field) => (
//                             <div key={field.name}>
//                                 <label className="block text-sm text-gray-300 mb-1">
//                                     {field.label}
//                                     {field.required && (
//                                         <span className="text-red-400 ml-1">
//                                             *
//                                         </span>
//                                     )}
//                                 </label>

//                                 {(field.type === "input" ||
//                                     field.type === "password") && (
//                                     <Input
//                                         type={
//                                             field.type === "password"
//                                                 ? "password"
//                                                 : "text"
//                                         }
//                                         placeholder={
//                                             field.placeholder || field.label
//                                         }
//                                         value={
//                                             (formData as any)[field.name] || ""
//                                         }
//                                         onChange={(e) =>
//                                             handleChange(
//                                                 field.name,
//                                                 e.target.value
//                                             )
//                                         }
//                                         className={`w-full bg-[#21173B]/70 border ${
//                                             errors[field.name]
//                                                 ? "border-red-400"
//                                                 : "border-purple-500/40"
//                                         } text-white rounded-md`}
//                                     />
//                                 )}

//                                 {field.type === "textarea" && (
//                                     <Textarea
//                                         rows={3}
//                                         placeholder={
//                                             field.placeholder || field.label
//                                         }
//                                         value={
//                                             (formData as any)[field.name] || ""
//                                         }
//                                         onChange={(e) =>
//                                             handleChange(
//                                                 field.name,
//                                                 e.target.value
//                                             )
//                                         }
//                                         className={`w-full bg-[#21173B]/70 border ${
//                                             errors[field.name]
//                                                 ? "border-red-400"
//                                                 : "border-purple-500/40"
//                                         } text-white rounded-md resize-none`}
//                                     />
//                                 )}

//                                 {field.type === "select" && (
//                                     <Select
//                                         value={
//                                             (formData as any)[
//                                                 field.name
//                                             ]?.toString() || ""
//                                         }
//                                         onValueChange={(v) =>
//                                             handleChange(field.name, v)
//                                         }
//                                     >
//                                         <SelectTrigger
//                                             className={`w-full h-10 bg-[#21173B]/70 border ${
//                                                 errors[field.name]
//                                                     ? "border-red-400"
//                                                     : "border-purple-500/40"
//                                             } text-gray-100 rounded-md`}
//                                         >
//                                             <SelectValue
//                                                 placeholder={
//                                                     field.placeholder ||
//                                                     `Chọn ${field.label}`
//                                                 }
//                                             />
//                                         </SelectTrigger>
//                                         <SelectContent className="bg-[#1E1538] border border-purple-600/40 text-gray-100 shadow-xl backdrop-blur-sm">
//                                             {field.options?.map((opt) => (
//                                                 <SelectItem
//                                                     key={opt.value}
//                                                     value={opt.value}
//                                                     className="hover:bg-purple-700/30 cursor-pointer text-gray-200"
//                                                 >
//                                                     {opt.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 )}

//                                 {field.type === "file" && (
//                                     <div className="space-y-3">
//                                         <label
//                                             className={`flex flex-col items-center justify-center w-full h-32
//                                             border-2 border-dashed rounded-xl cursor-pointer
//                                             ${
//                                                 imagePreview
//                                                     ? "border-purple-500/40 bg-[#2a1b48]/60"
//                                                     : "border-purple-400/30 bg-[#21173B]/50"
//                                             } hover:bg-[#2a1b48]/70 transition`}
//                                         >
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={(e) => {
//                                                     const file =
//                                                         e.target.files?.[0];
//                                                     if (file)
//                                                         handleFileChange(
//                                                             field.name,
//                                                             file
//                                                         );
//                                                 }}
//                                             />
//                                             {imagePreview ? (
//                                                 <Image
//                                                     src={imagePreview}
//                                                     alt="preview"
//                                                     width={100}
//                                                     height={100}
//                                                     className="rounded-lg object-cover border border-purple-600/40"
//                                                 />
//                                             ) : (
//                                                 <span className="text-gray-300 text-sm">
//                                                     📁 Chọn ảnh (PNG/JPG)
//                                                 </span>
//                                             )}
//                                         </label>
//                                     </div>
//                                 )}

//                                 {errors[field.name] && (
//                                     <p className="text-xs text-red-400 mt-1">
//                                         {errors[field.name]}
//                                     </p>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     <DialogFooter>
//                         <Button variant="ghost" onClick={onClose}>
//                             Hủy
//                         </Button>
//                         <Button
//                             onClick={() => {
//                                 if (!validateForm()) return;
//                                 onSubmit(formData, mode);
//                                 onClose();
//                             }}
//                             className="bg-gradient-to-r from-[#6A5AF9] to-[#FF5EDF] text-white shadow-[0_0_12px_rgba(255,94,223,0.4)]"
//                         >
//                             {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         );
//     }

//     if (mode === "delete" && item) {
//         return (
//             <AlertDialog open={open} onOpenChange={onClose}>
//                 <AlertDialogContent className="bg-gradient-to-br from-[#1A1034] to-[#2A1B47] border border-red-600/30 shadow-lg shadow-red-900/30 text-gray-100">
//                     <AlertDialogHeader>
//                         <AlertDialogTitle className="text-lg text-red-400">
//                             Xác nhận xóa {entityName}
//                         </AlertDialogTitle>
//                         <AlertDialogDescription className="text-gray-300">
//                             Bạn có chắc muốn xóa{" "}
//                             <span className="text-white font-semibold">
//                                 {(item as any).name ||
//                                     (item as any).fullName ||
//                                     "mục này"}
//                             </span>
//                             ? Hành động này không thể hoàn tác.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel className="bg-[#1E153A] text-gray-300 border border-gray-600/30 hover:bg-gray-800">
//                             Hủy
//                         </AlertDialogCancel>
//                         <AlertDialogAction
//                             className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]"
//                             onClick={() => {
//                                 onSubmit(item, "delete");
//                                 onClose();
//                             }}
//                         >
//                             Xóa
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         );
//     }

//     return null;
// }
"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadFile } from "./UploadFile";

export interface CrudField {
    name: string;
    label: string;
    type: "input" | "select" | "textarea" | "file" | "password";
    options?: { label: string; value: string }[];
    required?: boolean;
    placeholder?: string;
    validate?: (value: any, allValues?: Record<string, any>) => string | null;
}

interface CrudDialogProps<T> {
    mode: "add" | "edit" | "delete" | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<T>, mode: "add" | "edit" | "delete") => void;
    item?: T | null;
    entityName?: string;
    fields: CrudField[];
}

export function CrudDialog<T>({
    mode,
    open,
    onClose,
    onSubmit,
    item,
    entityName = "mục này",
    fields,
}: CrudDialogProps<T>) {
    const [formData, setFormData] = useState<Partial<T>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditMode = mode === "edit";

    const dynamicFields = useMemo(
        () =>
            fields.map((f) =>
                ["password", "confirmPassword"].includes(f.name)
                    ? { ...f, required: !isEditMode }
                    : f
            ),
        [fields, isEditMode]
    );

    // ✅ Khi mở dialog: load dữ liệu edit hoặc reset khi add
    useEffect(() => {
        if (mode === "edit" && item) {
            setFormData(item);
        } else if (mode === "add") {
            setFormData({});
        }
    }, [mode, item]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        dynamicFields.forEach((f) => {
            const value = (formData as any)[f.name];

            if (f.required && (value === undefined || value === "")) {
                newErrors[f.name] = `${f.label} là bắt buộc`;
            }

            if (f.validate) {
                const msg = f.validate(value, formData as any);
                if (msg) newErrors[f.name] = msg;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (mode === "add" || mode === "edit") {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent
                    className="bg-gradient-to-br from-[#1A1034] via-[#21173F] to-[#2A1B47]
          border border-purple-600/30 shadow-xl shadow-purple-900/30
          text-gray-100 max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6"
                >
                    <form
                        autoComplete="off"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!validateForm()) return;
                            onSubmit(formData, mode);
                            onClose();
                        }}
                        className="space-y-4 py-3"
                    >
                        {/* Ngăn Chrome autofill linh tinh */}
                        <input
                            type="text"
                            name="fake-user"
                            autoComplete="username"
                            style={{ display: "none" }}
                        />
                        <input
                            type="password"
                            name="fake-pass"
                            autoComplete="new-password"
                            style={{ display: "none" }}
                        />

                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-white">
                                {isEditMode
                                    ? `Chỉnh sửa ${entityName}`
                                    : `Thêm ${entityName} mới`}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                {isEditMode
                                    ? `Cập nhật thông tin ${entityName} đã chọn.`
                                    : `Điền thông tin ${entityName} mới vào form bên dưới.`}
                            </DialogDescription>
                        </DialogHeader>

                        {dynamicFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm text-gray-300 mb-1">
                                    {field.label}
                                    {field.required && (
                                        <span className="text-red-400 ml-1">
                                            *
                                        </span>
                                    )}
                                </label>

                                {(field.type === "input" ||
                                    field.type === "password") && (
                                    <Input
                                        name={`field-${field.name}`}
                                        autoComplete="off"
                                        type={
                                            field.type === "password"
                                                ? "password"
                                                : "text"
                                        }
                                        placeholder={
                                            field.placeholder || field.label
                                        }
                                        value={
                                            (formData as any)[field.name] || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                field.name,
                                                e.target.value
                                            )
                                        }
                                        className={`w-full bg-[#21173B]/70 border ${
                                            errors[field.name]
                                                ? "border-red-400"
                                                : "border-purple-500/40"
                                        } text-white rounded-md`}
                                    />
                                )}

                                {field.type === "textarea" && (
                                    <Textarea
                                        name={`field-${field.name}`}
                                        autoComplete="off"
                                        rows={3}
                                        placeholder={
                                            field.placeholder || field.label
                                        }
                                        value={
                                            (formData as any)[field.name] || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                field.name,
                                                e.target.value
                                            )
                                        }
                                        className={`w-full bg-[#21173B]/70 border ${
                                            errors[field.name]
                                                ? "border-red-400"
                                                : "border-purple-500/40"
                                        } text-white rounded-md resize-none`}
                                    />
                                )}

                                {field.type === "select" && (
                                    <Select
                                        value={
                                            (formData as any)[
                                                field.name
                                            ]?.toString() || ""
                                        }
                                        onValueChange={(v) =>
                                            handleChange(field.name, v)
                                        }
                                    >
                                        <SelectTrigger
                                            className={`w-full h-10 bg-[#21173B]/70 border ${
                                                errors[field.name]
                                                    ? "border-red-400"
                                                    : "border-purple-500/40"
                                            } text-gray-100 rounded-md`}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    field.placeholder ||
                                                    `Chọn ${field.label}`
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1E1538] border border-purple-600/40 text-gray-100 shadow-xl backdrop-blur-sm">
                                            {field.options?.map((opt) => (
                                                <SelectItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                    className="hover:bg-purple-700/30 cursor-pointer text-gray-200"
                                                >
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {field.type === "file" && (
                                    <UploadFile
                                        name={field.name}
                                        label={field.label}
                                        value={
                                            (formData as any)[
                                                field.name
                                            ] as string
                                        }
                                        onUploadComplete={(url) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.name]: url as any,
                                            }));
                                            setErrors((prev) => ({
                                                ...prev,
                                                [field.name]: "",
                                            }));
                                        }}
                                    />
                                )}

                                {errors[field.name] && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}

                        <DialogFooter>
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={onClose}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-[#6A5AF9] to-[#FF5EDF] text-white shadow-[0_0_12px_rgba(255,94,223,0.4)]"
                            >
                                {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    // Xác nhận xóa
    if (mode === "delete" && item) {
        return (
            <AlertDialog open={open} onOpenChange={onClose}>
                <AlertDialogContent className="bg-gradient-to-br from-[#1A1034] to-[#2A1B47] border border-red-600/30 shadow-lg shadow-red-900/30 text-gray-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg text-red-400">
                            Xác nhận xóa {entityName}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Bạn có chắc muốn xóa{" "}
                            <span className="text-white font-semibold">
                                {(item as any).name ||
                                    (item as any).fullName ||
                                    "mục này"}
                            </span>
                            ? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#1E153A] text-gray-300 border border-gray-600/30 hover:bg-gray-800">
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                            onClick={() => {
                                onSubmit(item, "delete");
                                onClose();
                            }}
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return null;
}
