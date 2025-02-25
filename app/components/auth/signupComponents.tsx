'use client';
import { emailSchema, userNameSchema, userSchema } from "@/schemas/auth";
import { UseVaildate } from "@/app/hooks/useVaildate";
import { EmailValidateError, UserNameValidateError, UserValidateError } from "@/app/types/signupValidate";
import React, { useEffect, useRef, useState } from "react";
import { useSignupStore } from "@/app/types/signupStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import jsonData from '@/app/components/auth/Policy.json';
import { addUserKey, createAuthCookie } from "./authFunctions";


type Props = {
    message: string;
    error: boolean;
    className?: string;
    color?: string;
}
type IconProps = {
    error: boolean;
}

export function ValidateIcon({ error }: IconProps) {
    return (
        <span className={`badge badge-xs ${error ? 'badge-error' : 'badge-success'}`}></span>
    );
}

export function ValidateSpan({ message, error, className, color }: Props) {
    return (
        <span className={`label-text-alt text-left pl-[1.25rem] ${className}`}
            style={{ display: error ? 'block' : 'none', color: color }}>
            {message}
        </span>
    );
}


// 공백에 _를 추가하는 함수
function FormatStringArray(input: string[]): string[] {
    return input.map((str) => str.replace(/\s+/g, "_").toUpperCase());
}

export function SignupStep() {

    const [personalInfoAgree, setpersonalInfoAgree] = useState<boolean>(false);
    const [termsAgree, settermsAgree] = useState<boolean>(false);
    const [isAgree, setIsAgree] = useState<boolean>(false);
    const setAgree = useSignupStore(state => state.setagree);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
    const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
    const termsData = {
        privacyPolicy: jsonData.privacyPolicy,
        termsOfService: jsonData.termsOfService
    };


    const router = useRouter();
    useEffect(() => {
        setIsAgree(personalInfoAgree && termsAgree);
    }, [personalInfoAgree, termsAgree]);

    const checkboxChange = (e: React.ChangeEvent<HTMLInputElement>,
        setFunction: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setFunction(e.target.checked);
    };

    const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAgree(true);
        router.push('/signup/step1');
    }

    const handlePrivacy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setIsPrivacyOpen((prev) => !prev);
    }
    const handleTerms = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setIsTermsOpen((prev) => !prev);
    }

    return (
        <form onSubmit={handleSumbit} className='flex flex-col gap-[0.75rem] flex-grow' >
            <div className='card'>
                <div className="form-control primary">
                    <label className="cursor-pointer label">
                        <div className="flex flex-row gap-2 items-center">
                            <input type="checkbox" className='dropdown-checkbox mr-1'
                                onChange={(e) => checkboxChange(e, setpersonalInfoAgree)} />
                            <span className="label-text">Privacy Policy</span>
                        </div>
                        <div className='flex justify-center'>
                            <button
                                onClick={handlePrivacy}
                                type='button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                                    <path d="M0.613336 2.61331L4.06667 6.06665C4.58667 6.58665 5.42667 6.58665 5.94667 6.06665L9.4 2.61331C10.24 1.77331 9.64 0.333313 8.45334 0.333313H1.54667C0.360002 0.333313 -0.226664 1.77331 0.613336 2.61331Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                    </label>
                    {isPrivacyOpen && <div className='terms-wrapper'>
                        <div className={`privacy-policy ${isPrivacyOpen ? 'open' : ''}`}>
                            {termsData.privacyPolicy.sections.map((section, index) => (
                                <div key={index}>
                                    <br />
                                    <h2 className='terms-h2'>{section.heading}</h2>
                                    <br />
                                    <p>{section.content}</p>
                                    {section.list && (
                                        <ul>
                                            {section.list.map((item, listIndex) => (
                                                <li key={listIndex}>- {item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.footer && <p>{section.footer}</p>}
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
                <div className="form-control">
                    <label className="cursor-pointer label">
                        <div className="flex flex-row gap-2 items-center">
                            <input type="checkbox" className='dropdown-checkbox mr-0'
                                onChange={(e) => checkboxChange(e, settermsAgree)} />
                            <span className="label-text">Terms of Service</span>
                        </div>
                        <div className='flex justify-center'>
                            <button
                                type='button'
                                onClick={handleTerms}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                                    <path d="M0.613336 2.61331L4.06667 6.06665C4.58667 6.58665 5.42667 6.58665 5.94667 6.06665L9.4 2.61331C10.24 1.77331 9.64 0.333313 8.45334 0.333313H1.54667C0.360002 0.333313 -0.226664 1.77331 0.613336 2.61331Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                    </label>
                    {isTermsOpen && <div className='terms-wrapper' style={{ color: 'black', textAlign: 'left' }}>
                        <div className={`privacy-policy ${isTermsOpen ? 'open' : ''}`}>
                            {termsData.termsOfService.sections.map((section, index) => (
                                <div key={index}>
                                    <br />
                                    <h2 className='terms-h2'>{section.heading}</h2>
                                    <br />
                                    <p>{section.content}</p>
                                    {section.list && (
                                        <ul>
                                            {section.list.map((item, listIndex) => (
                                                <li key={listIndex}>- {item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
            <button
                className='auth-button auth-button-id sign-up-button-text'
                disabled={!isAgree}
            >Next
            </button>
        </form>
    );
}


export function SignupStep1() {
    const email = useSignupStore(state => state.email);
    const setemail = useSignupStore(state => state.setemail);
    const [authNum, setAuthNum] = useState<string>('');
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState<boolean>(true);
    const [emailSendMessage, setemailSendMessage] = useState<string>('');
    const [sendMessageVisiblity, setSendMessageVisiblity] = useState<boolean>(false);
    const router = useRouter();
    const { errors, validateField } = UseVaildate<EmailValidateError>(emailSchema);
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState<boolean>(true);
    const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState<boolean>(true);
    const [inputBorderColor, setInputBorderColor] = useState<string>('border-none');
    const [emailVerifyMessage, setEmailVerifyMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');
    const [emailSendMessageColor, setEmailSendMessageColor] = useState<string>('text-green-500');
    const [timer, setTimer] = useState<number>(180);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const [emailVerifyInputVisible, setEmailVerifyInputVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startTimer = () => {
        setTimer(180);
        setIsTimerActive(true);
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
        setemail(value);
        //이메일 중복체크 포함
    };

    // 이메일 전송 포스트 요청
    const sendEmail = async () => {
        setIsLoading(true);
        axios.get(`${process.env.NEXT_PUBLIC_ROOT_API}/users/checkEmail`, //이메일 요청 엔드포인트 수정
            {
                params: {
                    email: email
                },
                validateStatus: (status) => {
                    // 200, 409 상태 코드만 정상으로 처리하고 나머지는 오류로 처리
                    return status >= 200 && status < 300 || status === 409;
                }
            }
        ).then(function (response) {
            if (response.status === 200) {
                setEmailSendMessageColor('text-green-500');
                setemailSendMessage('Verification code has been sent to your email');
                setSendMessageVisiblity(true);
                setEmailVerifyInputVisible(true);
                setIsSendButtonDisabled(true);
                startTimer();
            }
            else if (response.status === 409) {
                if (response.data.message === '재가입 유저입니다. 인증 메일을 발송했습니다.') {
                    setEmailSendMessageColor('text-green-500');
                    setemailSendMessage('Verification code has been successfully sent to the re-registered user');
                    setSendMessageVisiblity(true);
                    setEmailVerifyInputVisible(true);
                    setIsSendButtonDisabled(true);
                    startTimer();
                }
                else {
                    setEmailSendMessageColor('text-red-500');
                    setemailSendMessage('Email already exists');
                    setEmailVerifyInputVisible(false);
                    setSendMessageVisiblity(true);
                }
            }
            else {
                setEmailSendMessageColor('text-red-500');
                setemailSendMessage('Failed to send verification code please try again');
                setEmailVerifyInputVisible(false);
                setSendMessageVisiblity(true);
            }
        }).catch(function () {
            setEmailSendMessageColor('text-red-500');
            setemailSendMessage('Failed to send verification code please try again');
            setEmailVerifyInputVisible(false);
            setSendMessageVisiblity(false);
        }).finally(() => {
            setIsLoading(false)
        });
    }

    // 응답 성공, 실패 시 const [inputBorderColor, setInputBorderColor] = useState<string>('border-none'); 로
    // inputBorderColor를 변경해주는데 페이지에서 적용이 안됨 확인필요 25.01.13

    const emailVerify = async () => {
        axios.post(`${process.env.NEXT_PUBLIC_ROOT_API}/register/emailAuth`,
            {
                email: email,
                authNum: authNum
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(function (response) {
            if (response.status === 200) {
                setMessageColor('text-green-500');
                setEmailVerifyMessage('Email verification success!');
                setInputBorderColor('border-green-500');
                setIsNextButtonDisabled(false);
                setIsTimerActive(false);
            } else {
                setMessageColor('text-red-500');
                setInputBorderColor('border-red-500 border-opacity-100');
                setEmailVerifyMessage('The verification code is incorrect. Please check again');
            }
        }).catch(function (error) {
            if (error.response.status === 400) {
                setMessageColor('text-red-500');
                setInputBorderColor('border-red-500 border-opacity-100');
                setEmailVerifyMessage('The verification code is incorrect. Please check again');
            }
        });
    };



    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        if (isTimerActive && timer > 0) {
            timerInterval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
            setSendMessageVisiblity(false); // 메시지 숨김
            setEmailVerifyInputVisible(false); // 인증번호 입력창 숨김
            setIsSendButtonDisabled(false); // Send 버튼 다시 활성화
        }
        return () => clearInterval(timerInterval); // cleanup
    }, [isTimerActive, timer]);



    useEffect(() => {
        setIsSendButtonDisabled(!!errors?.email || !email.trim()); //유효성 검사 통과해야 send 버튼 활성화
    }, [errors, email]);

    useEffect(() => {
        setIsVerifyButtonDisabled(!authNum.trim());
    }, [authNum]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push('/signup/step2');
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-[0.75rem] flex-grow'>
            <label htmlFor="email" className="flex auth-input-label items-center">
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    placeholder="email@example.com"
                    onChange={handleChange}
                    className='auth-placeholder grow text-left' />
                <button
                    className='flex items-center justify-center verify-button-send verify-button nav-text-button'
                    onClick={sendEmail}
                    disabled={isSendButtonDisabled || isLoading}
                    type='button'
                >
                    Send
                </button>
            </label>
            <div>
                {errors?.email && <ValidateSpan message={errors?.email[0]} error={!!errors?.email}></ValidateSpan>}
                {emailSendMessage && <ValidateSpan message={emailSendMessage} error={sendMessageVisiblity}
                    className={emailSendMessageColor}
                ></ValidateSpan>}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center gap-2 mt-2">
                    <p className="text-gray-500">Sending email, please wait...</p>
                    <span className="loading loading-spinner loading-xs"></span>
                </div>
            )}
            {emailVerifyInputVisible && (<label htmlFor="authNum"
                className={`flex auth-input-label items-center ${inputBorderColor}`}>
                <input
                    id="authNum"
                    name="authNum"
                    type="text"
                    placeholder="Enter verification code"
                    className='auth-placeholder grow text-left'
                    value={authNum}
                    onChange={(e) => setAuthNum(e.target.value)}
                />
                <button className='flex items-center justify-center verify-button-send verify-button nav-text-button'
                    disabled={isVerifyButtonDisabled}
                    onClick={emailVerify}
                    type='button'>
                    Verify
                </button>
            </label>
            )}
            {isTimerActive && (
                <div className="text-gray-500 text-sm text-left pl-[1.25rem]">
                    Verification code expires in: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
                    {timer % 60} minutes
                </div>
            )}
            <div>
                {emailVerifyMessage && <ValidateSpan message={emailVerifyMessage} error={!!emailVerifyMessage}
                    className={messageColor}></ValidateSpan>}
            </div>

            {/* 인증 메시지 처리 넣어줘야함 */}
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
                disabled={isNextButtonDisabled}
            >Next
            </button>
        </form >
    );
}

export function SignupStep2() {
    const { errors, validateField } = UseVaildate<UserValidateError>(userSchema);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [checkButtonDisabled, setCheckButtonDisabled] = useState<boolean>(true);
    const [canUseId, setCanUseId] = useState<boolean>(false);
    const [idDuplicateMessage, setidDuplicateMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');
    const [userIdValidationMessages, setUserIdValidationMessages] = useState<string[]>([]);
    const [passwordValidationMessages, setPasswordValidationMessages] = useState<string[]>([]);

    //재가입을 위한 유저 이메일 체크용 상태관리에서 이메일 받아오기
    const email = useSignupStore(state => state.email);



    const userId = useSignupStore(state => state.userId);
    const setuserId = useSignupStore(state => state.setuserId);
    const password = useSignupStore(state => state.password);
    const setpassword = useSignupStore(state => state.setpassword);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
        if (name === 'userId') {
            setuserId(value);  // userId만 업데이트
            validateUserId(value);
            setidDuplicateMessage(''); // userId가 변경되면 중복 메시지 초기화
            setCanUseId(false); // userId가 변경되면 중복 확인 여부 초기화화
        } else if (name === 'password') {
            setpassword(value);  // password만 업데이트
            validatePassword(value);
        }
    };

    const CheckIdDuplicateHandler = async () => {
        axios({
            method: 'get',
            url: `${process.env.NEXT_PUBLIC_ROOT_API}/users/checkUserId`,
            params: {
                userId: userId,
                email: email
            },
            responseType: 'json',
            validateStatus: (status) => {
                // 200, 409 상태 코드만 정상으로 처리하고 나머지는 오류로 처리
                return status >= 200 && status < 300 || status === 409;
            }
        }).then(function (response) {
            //이미 있는 경우 true 반환
            if (response.data === true) {
                setCanUseId(false);
                setidDuplicateMessage('This ID is already exist');
                setMessageColor('red');
            }
            else {
                setCanUseId(true);
                setidDuplicateMessage('✓ This ID is available');
                setMessageColor('green');
            }
        }).catch(function () {
            setCanUseId(false);
            setidDuplicateMessage('Failed to check ID');
            setMessageColor('red');
        });
    }

    useEffect(() => {
        const isFormValid = userId.trim() && password.trim();  // userId와 password가 공백이 아니어야 활성화
        const hasErrors = !!errors?.userId || !!errors?.password;  // errors가 있으면 비활성화
        const passIdDuplicate = !canUseId;

        setIsButtonDisabled(hasErrors || !isFormValid || passIdDuplicate);  // 오류가 있거나 유효성 검사 실패시 비활성화
    }, [errors, userId, password, canUseId]);

    useEffect(() => {
        setCheckButtonDisabled(!userId.trim() || !!errors?.userId);
    }, [userId, errors]);


    const PasswordToggle = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push('/signup/step3');
    }

    const validateUserId = (value: string) => {
        const messages: string[] = [];

        // 1. 최소 4자 이상, 최대 20자 이하
        if (value.length < 4 || value.length > 20) {
            messages.push('User ID must be between 4 and 20 characters.');
        } else {
            messages.push('✓ User ID length is valid.');
        }

        // 2. 숫자로 시작하지 않음
        if (/^\d/.test(value)) {
            messages.push('User ID cannot start with a number.');
        } else {
            messages.push('✓ User ID does not start with a number.');
        }

        // 3. 알파벳 포함
        if (!/[a-zA-Z]/.test(value)) {
            messages.push('User ID must contain at least one letter.');
        } else {
            messages.push('✓ User ID contains a letter.');
        }

        // 4. 문자와 숫자만 포함
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
            messages.push('User ID can only contain letters and numbers.');
        } else {
            messages.push('✓ User ID contains only letters and numbers.');
        }

        setUserIdValidationMessages(messages);
    };
    const validatePassword = (value: string) => {
        const messages: string[] = [];

        // 1. 최소 8자 이상, 최대 20자 이하
        if (value.length < 8 || value.length > 20) {
            messages.push('Password must be between 8 and 20 characters.');
        } else {
            messages.push('✓ Password length is valid.');
        }

        // 2. 알파벳 포함
        if (!/[a-zA-Z]/.test(value)) {
            messages.push('Password must contain at least one letter.');
        } else {
            messages.push('✓ Password contains a letter.');
        }

        // 3. 숫자 포함
        if (!/\d/.test(value)) {
            messages.push('Password must contain at least one number.');
        } else {
            messages.push('✓ Password contains a number.');
        }

        // 4. 특수문자 포함
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            messages.push('Password must contain at least one special character.');
        } else {
            messages.push('✓ Password contains a special character.');
        }

        setPasswordValidationMessages(messages);
    };



    return (

        <form onSubmit={handleSubmit} className='flex flex-col gap-[0.75rem] flex-grow'>
            <label htmlFor="userId" className="flex auth-input-label items-center">
                <input
                    id="userId"
                    name="userId"
                    type="text"
                    placeholder="Enter Your Id"
                    onChange={handleChange}
                    value={userId}
                    className='auth-placeholder grow text-left' />
                <button className='flex items-center justify-center verify-button-send verify-button nav-text-button'
                    type='button'
                    onClick={CheckIdDuplicateHandler}
                    disabled={checkButtonDisabled}
                >
                    Check
                </button>
            </label>
            <div>
                {userIdValidationMessages.map((message, index) => (
                    <span className='label-text-alt text-left pl-[1.25rem]' key={index} style={{
                        color: message.startsWith('✓') ? 'green' : 'red',
                        display: 'block'
                    }}>
                        {message}
                    </span>
                ))}


                {idDuplicateMessage && <ValidateSpan message={idDuplicateMessage} error={!!idDuplicateMessage}
                    color={messageColor}></ValidateSpan>}
            </div>

            <label htmlFor="password" className="flex auth-input-label items-center">
                <input
                    id="password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={handleChange}
                    className='auth-placeholder grow text-left' />
                <button type='button' className='flex items-center justify-center' onClick={PasswordToggle}>
                    {passwordVisible ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_112_3055)">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#6A7784" />
                        </g>
                        <defs>
                            <clipPath id="clip0_112_3055">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                        :
                        <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.83 6L14 9.16C14 9.11 14 9.05 14 9C14 8.20435 13.6839 7.44129 13.1213 6.87868C12.5587 6.31607 11.7956 6 11 6C10.94 6 10.89 6 10.83 6ZM6.53 6.8L8.08 8.35C8.03 8.56 8 8.77 8 9C8 9.79565 8.31607 10.5587 8.87868 11.1213C9.44129 11.6839 10.2044 12 11 12C11.22 12 11.44 11.97 11.65 11.92L13.2 13.47C12.53 13.8 11.79 14 11 14C9.67392 14 8.40215 13.4732 7.46447 12.5355C6.52678 11.5979 6 10.3261 6 9C6 8.21 6.2 7.47 6.53 6.8ZM1 1.27L3.28 3.55L3.73 4C2.08 5.3 0.78 7 0 9C1.73 13.39 6 16.5 11 16.5C12.55 16.5 14.03 16.2 15.38 15.66L15.81 16.08L18.73 19L20 17.73L2.27 0M11 4C12.3261 4 13.5979 4.52678 14.5355 5.46447C15.4732 6.40215 16 7.67392 16 9C16 9.64 15.87 10.26 15.64 10.82L18.57 13.75C20.07 12.5 21.27 10.86 22 9C20.27 4.61 16 1.5 11 1.5C9.6 1.5 8.26 1.75 7 2.2L9.17 4.35C9.74 4.13 10.35 4 11 4Z" fill="#6A7784" />
                        </svg>
                    }
                </button>
            </label>
            <div>
                {passwordValidationMessages.map((message, index) => (
                    <span className='label-text-alt text-left pl-[1.25rem]' key={index} style={{
                        color: message.startsWith('✓') ? 'green' : 'red',
                        display: 'block'
                    }}>
                        {message}
                    </span>
                ))}
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
                disabled={isButtonDisabled}
            >Next
            </button>
        </form >

    );
}


export function SignupStep3() {
    const { errors, validateField } = UseVaildate<UserNameValidateError>(userNameSchema);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const userName = useSignupStore(state => state.userName);
    const setuserName = useSignupStore(state => state.setuserName);
    const router = useRouter();
    //이미지 상태관리 (디폴트값 : noImage)
    const setImage = useSignupStore(state => state.setImage);

    //이미지 업로드
    const [profileImage, setProfileImage] = useState<File | null>(null); // 선택한 이미지 파일
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 URL

    //이메일 체크용
    const email = useSignupStore(state => state.email);

    const [canUseUserName, setCanUseuserName] = useState<boolean>(false);
    const [userNameDuplicateMessage, setUserNameDuplcateMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');
    const [checkButtonDisabled, setCheckButtonDisabled] = useState<boolean>(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
        if (name === 'userName') {
            setuserName(value);
            setUserNameDuplcateMessage('');
            setCanUseuserName(false);
        }
    };

    const CheckUserNameDuplicateHandler = async () => {
        axios({
            method: 'get',
            url: `${process.env.NEXT_PUBLIC_ROOT_API}/users/checkUserName`,
            params: {
                userName: userName,
                email: email
            },
            responseType: 'json'
        }).then(function (response) {
            //이미 있는 경우 true 반환
            if (response.data === true) {
                setCanUseuserName(false);
                setUserNameDuplcateMessage('This userName is already exist');
                setMessageColor('text-red-500');
            }
            else {
                setCanUseuserName(true);
                setUserNameDuplcateMessage('This userName is available');
                setMessageColor('text-green-500');
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        setIsButtonDisabled(!!errors?.userName || !userName.trim() || !canUseUserName);
    }, [errors, userName, canUseUserName]);

    useEffect(() => {
        setCheckButtonDisabled(!userName.trim() || !!errors?.userName);
    }, [userName, errors]);

    //폼 제출 시 이미지 제출도 저장
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);
            formData.append('type', 'PROFILE');
            axios({
                method: 'post',
                url: `${process.env.NEXT_PUBLIC_ROOT_API}/images/upload`,
                data: formData,
            }).then(function (response) {
                if (response.status === 200) {
                    setImage(response.data[0]);
                    router.push('/signup/step4');
                }
            }).catch(function (error) {
                console.log('failed image upload catch', error);
            });
        }

        router.push('/signup/step4');
    }

    //이미지 업로드 포스트 요청
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // 파일 유형 및 크기 제한한
        const allowedTypes = ["image/jpg", "image/jpeg", "image/JPG", "image/JPEG",
            'image/png', 'image/PNG'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
            e.target.value = '';
            return;
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('10MB 이하의 파일만 업로드 가능합니다.');
            e.target.value = '';
            return;
        }

        // 선택한 파일을 상태에 저장
        setProfileImage(file);
        // 미리보기 URL 생성
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
    };


    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-[0.75rem] flex-grow'>
            {/* 이미지 업로드용 숨겨진 input */}
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{
                    display: "none", // input을 숨기기
                }}
                onChange={handleFileChange} // 파일 선택 시 처리
            />
            <label className='flex items-center gap-8'>
                {/* 원형 미리보기 이미지 및 아이콘 */}
                <div
                    style={{
                        width: "6.25rem",
                        height: "6.25rem",
                        borderRadius: "50%",
                        backgroundColor: "#F1F3F6",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer", // 클릭 시 커서 변경
                        position: "relative",
                        overflow: previewUrl ? 'hidden' : 'visible'
                    }}
                    onClick={() => document.getElementById('fileInput')?.click()} // 클릭 시 파일 선택
                >
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="미리보기"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            fill
                        />
                    ) : null}
                    {previewUrl ?
                        null :
                        (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                className='camera-circle'
                            >
                                <circle cx="12" cy="12" r="11.5" fill="white" stroke="#C7C7CC" />

                                <svg
                                    className="camera-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="-4 -4 24 24"
                                    fill="none"
                                >
                                    <g clipPath="url(#clip0_112_2331)">
                                        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="#8E8E93" />
                                        <path d="M12.8 3.22222H10.898L10.154 2.39722C9.932 2.14667 9.608 2 9.272 2H6.728C6.392 2 6.068 2.14667 5.84 2.39722L5.102 3.22222H3.2C2.54 3.22222 2 3.77222 2 4.44444V11.7778C2 12.45 2.54 13 3.2 13H12.8C13.46 13 14 12.45 14 11.7778V4.44444C14 3.77222 13.46 3.22222 12.8 3.22222ZM8 11.1667C6.344 11.1667 5 9.79778 5 8.11111C5 6.42444 6.344 5.05556 8 5.05556C9.656 5.05556 11 6.42444 11 8.11111C11 9.79778 9.656 11.1667 8 11.1667Z" fill="#8E8E93" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_112_2331">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </svg>
                        )
                    }
                </div>

                {/* 텍스트 */}
                <span className='signup-text signup-text-gray'>
                    Set Your Profile Image
                </span>
            </label>
            <label htmlFor="userName" className="flex auth-input-label items-center">
                <input
                    id="userName"
                    name="userName"
                    type="userName"
                    placeholder="Enter Your Name"
                    onChange={handleChange}
                    value={userName}
                    className='auth-placeholder grow text-left' />
                <button
                    type='button'
                    className='flex items-center justify-center verify-button-send verify-button nav-text-button'
                    onClick={CheckUserNameDuplicateHandler}
                    disabled={checkButtonDisabled}
                >
                    Check
                </button>
            </label>
            <div>
                {errors?.userName && <ValidateSpan message={errors?.userName[0]} error={!!errors?.userName}></ValidateSpan>}
                {userNameDuplicateMessage && <ValidateSpan message={userNameDuplicateMessage} error={!!userNameDuplicateMessage}
                    className={messageColor}></ValidateSpan>}
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
                disabled={isButtonDisabled}
            >Next
            </button>
        </form>
    );
}

const DropDownIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <g clipPath="url(#clip0_112_2361)">
                <path d="M11.6133 15.6133L15.0667 19.0666C15.5867 19.5866 16.4267 19.5866 16.9467 19.0666L20.4 15.6133C21.24 14.7733 20.64 13.3333 19.4533 13.3333H12.5467C11.36 13.3333 10.7733 14.7733 11.6133 15.6133Z" fill="black" />
            </g>
            <defs>
                <clipPath id="clip0_112_2361">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

const DropDownIconReverse = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M20.3867 16.3867L16.9333 12.9334C16.4133 12.4134 15.5733 12.4134 15.0533 12.9334L11.6 16.3867C10.76 17.2267 11.36 18.6667 12.5467 18.6667L19.4533 18.6667C20.64 18.6667 21.2267 17.2267 20.3867 16.3867Z" fill="black" />
        </svg>
    )
}

type DropdownProps = {
    options: string[];
    buttonName: string;
    isMultiSelect?: boolean;
    buttonColor?: string;
    onSelect: (selected: string | string[]) => void;
}
export function Dropdown({ options, buttonName, isMultiSelect, onSelect,buttonColor }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // 선택된 항목 리스트
    const [selectedItem, setSelectedItem] = useState<string | null>(null); // 단일 선택용
    const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 외부 클릭 감지

    // 드롭다운 토글
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    // 항목 선택
    const selectItem = (item: string) => {
        if (isMultiSelect) {
            if (selectedItems.includes(item)) {
                // 체크 해제: 선택된 항목에서 제거
                const newSelectedItems = selectedItems.filter((selected) => selected !== item);
                setSelectedItems(newSelectedItems);
                onSelect(newSelectedItems); // 부모로 선택된 항목 전달
            } else {
                // 체크: 선택된 항목에 추가
                const newSelectedItems = [...selectedItems, item];
                setSelectedItems(newSelectedItems);
                onSelect(newSelectedItems); // 부모로 선택된 항목 전달
            }
        } else {
            setSelectedItem(item);
            setIsOpen(false);
            onSelect(item); // 부모로 선택된 항목 전달
        }
    };

    // 뱃지 삭제
    const removeBadge = (item: string) => {
        if (isMultiSelect) {
            const newSelectedItems = selectedItems.filter((selected) => selected !== item);
            setSelectedItems(newSelectedItems);
            onSelect(newSelectedItems); // 부모로 선택된 항목 전달
        } else {
            setSelectedItem(null);
            onSelect(""); // 부모로 선택 해제 상태 전달
        }
    };

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="dropdown-container">
            {/* 드롭다운 버튼 */}
            <button
                type="button"
                onClick={toggleDropdown}
                className="profile-dropdown-button"
            >
                <span>{buttonName}</span>
                {!isOpen ? <DropDownIcon /> : <DropDownIconReverse />}
            </button>

            {/* 드롭다운 리스트 */}
            {isOpen && (
                <div className="dropdown-list">
                    <ul>
                        {options.map((option) => (
                            <li
                                key={option}
                                className="dropdown-item flex"
                                onClick={() => selectItem(option)}
                            >
                                <span className="flex">{option}</span>
                                {/* 여기에 체크박스 추가 */}
                                {isMultiSelect ? (
                                    <span className='dropdown-checkbox'>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(option)}
                                            onChange={() => selectItem(option)}
                                        />
                                    </span>) :
                                    (
                                        null
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 선택된 항목 표시 (뱃지) */}
            <div className='dropdown-badge-container'>
                {isMultiSelect ? selectedItems.map((item) => (
                    <button
                        key={item}
                        className="dropdown-badge dropdown-badge-green"
                        onClick={() => removeBadge(item)}
                        style={{ backgroundColor: buttonColor }}
                    >
                        {item} ×
                    </button>
                ))
                    : selectedItem && (
                        <button
                            key={selectedItem}
                            className="dropdown-badge dropdown-badge-green"
                            onClick={() => removeBadge(selectedItem)}
                            style={{ backgroundColor: buttonColor }}
                        >
                            {selectedItem} ×
                        </button>
                    )}
            </div>
        </div>
    );
}

export function SignupStep4() {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null); // 지역 선택 상태
    const [selectedReligions, setSelectedReligions] = useState<string | null>(null); // 종교 선택 상태
    const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState<string[]>([]); // 식습관 선택 상태
    const [selectedChronicDisease, setSelectedChronicDisease] = useState<string[]>([]); // 만성질환 선택 상태
    const router = useRouter();

    const setNationality = useSignupStore(state => state.setnationality);
    const setReligion = useSignupStore(state => state.setreligion);
    const setDietaryPreferences = useSignupStore(state => state.setDietaryPreferences);
    const setChronicDiseaseTypes = useSignupStore(state => state.setChronicDiseaseTypes);

    const countryList: string[] = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Comoros",
        "Congo (Congo-Brazzaville)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czechia (Czech Republic)",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini (fmr. Swaziland)",
        "Ethiopia",
        "Fiji",
        "Finland",
        "France",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Greece",
        "Grenada",
        "Guatemala",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Holy See",
        "Honduras",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (North)",
        "Korea (South)",
        "Kosovo",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Morocco",
        "Mozambique",
        "Myanmar (Burma)",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "North Macedonia",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine State",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Sweden",
        "Switzerland",
        "Syria",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];
    const religionList: string[] = ["Atheism", "Christianity", "Buddhism", "Catholicism", "Islam",
        "Hinduism"];
    const dietaryPreferences: string[] = ['Halal', 'Kosher', "Vegetarian", "Vegan",
        "Pescatarian", "Low Spice tolerance", "No Alcohol", 'Gluten Free', 'Lactose Free', 'Low Carb'];
    const chronicDiseaseList: string[] = ['Cancer', 'Diabetes', 'Osteoporosis', 'Heart Disease'];
    const isFormValid = selectedCountry && selectedReligions;


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSelectedCountry(selectedCountry);
        setSelectedReligions(selectedReligions);
        setSelectedDietaryPreferences(selectedDietaryPreferences);
        setSelectedChronicDisease(selectedChronicDisease);

        // useSignupStore 상태 업데이트 (대문자로 변환, 공백에 _ 추가)
        setNationality((selectedCountry ?? "").toUpperCase());  // 국가 정보 설정
        setReligion((selectedReligions ?? "").toUpperCase());   // 종교 정보 설정
        setDietaryPreferences(FormatStringArray(selectedDietaryPreferences));  // 식습관 설정
        setChronicDiseaseTypes(FormatStringArray(selectedChronicDisease)); // 만성질환 설정


        router.push('/signup/step5');
    }


    return (
        <form onSubmit={handleSubmit} className='signup-text signup-text-black flex-grow flex flex-col gap-[8rem]'>
            <div>
                <Dropdown
                    options={countryList}
                    buttonName="Select Your Country"
                    isMultiSelect={false}
                    onSelect={(selected) => setSelectedCountry(selected as string | null)}
                    buttonColor='#E0E4EB'
                />
            </div>
            <div>
                <Dropdown
                    options={religionList}
                    buttonName="Select Your Religion"
                    isMultiSelect={false}
                    onSelect={(selected) => setSelectedReligions(selected as string | null)}
                />
            </div>
            <div>
                <Dropdown
                    options={dietaryPreferences}
                    buttonName="Select Your DietaryPreferences"
                    isMultiSelect={true}
                    onSelect={(selected) => setSelectedDietaryPreferences(selected as string[])}
                />
            </div>
            <div>
                <Dropdown
                    options={chronicDiseaseList}
                    buttonName="Select Your Chronic Disease"
                    isMultiSelect={true}
                    onSelect={(selected) => setSelectedChronicDisease(selected as string[])}
                    buttonColor="#FFC4B3"
                />
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
                disabled={!isFormValid}
            >Next
            </button>
        </form >
    );
}

export function SignupStep5() {
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]); // 알레르기 선택 상태
    const [AllergiesSearch, setAllergiesSearch] = useState<string>(''); // 검색어 상태
    const [showDropdown, setShowDropdown] = useState<boolean>(false); // 드롭다운 표시 여부
    const inputRef = useRef<HTMLInputElement | null>(null);

    const seaFoodAllergieList = ['Abalone', 'Crab', 'Fish', 'Mussel', 'Oyster', 'Shellfish', 'Shrimp', 'Squid'];
    const fruitAllergieList = ['Peach', 'Tomato'];
    const nutsAllergieList = ['Buck wheat', 'Peanut', 'Pine nut', 'Soybean', 'Walnut', 'Wheat'];
    const meatAllergieList = ['Beef', 'Chicken', 'Eggs', 'Milk', 'Pork'];
    const etcAllergieList = ['Sulfurous'];

    const router = useRouter();
    const setAllergyTypes = useSignupStore(state => state.setAllergyTypes);

    // 최종 회원 가입을 위한 상태 가져오기
    const { userId, email, password, userName, nationality, religion, agree, chronicDiseaseTypes, dietaryPreferences, image } = useSignupStore.getState();

    // 모든 알레르기 리스트 합치기기
    const allAllergies = [...seaFoodAllergieList, ...fruitAllergieList, ...nutsAllergieList, ...meatAllergieList, ...etcAllergieList];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAllergyTypes(FormatStringArray(selectedAllergies));
        const { allergyTypes } = useSignupStore.getState();

        const signupData = {
            userId, email, password, userName, nationality, religion, agree,
            ...(allergyTypes && allergyTypes.length > 0 && { allergyTypes }), // 배열의 경우 빈 배열 제외
            ...(chronicDiseaseTypes && chronicDiseaseTypes.length > 0 && { chronicDiseaseTypes }),
            ...(dietaryPreferences && dietaryPreferences.length > 0 && { dietaryPreferences }),
            ...(image && { image }),
        };



        axios.post(`${process.env.NEXT_PUBLIC_ROOT_API}/users/register`, signupData)
            .then(response => {
                if (response.status === 200) {
                    alert('All set! Welcome aboard!');
                    //회원가입 후 바로 로그인 하고 메인 페이지로 이동
                    axios.post(`${process.env.NEXT_PUBLIC_ROOT_API}/auth/login`,
                        { userId, password })
                        .then(function (response) {
                            if (response.status === 200) {
                                const Authorization = response.headers['authorization'];
                                localStorage.setItem('Authorization', Authorization);
                                // 미들웨어를 위한 쿠키 설정
                                createAuthCookie(Authorization);

                                //userKey 추가
                                addUserKey(response.data.userKey);

                                router.push('/');
                            }
                        }).catch(function () {
                            router.push('/login');
                        }
                        );

                    // router.push('/login');
                } else {
                    alert('The error occurred. Please try again from the beginning.');
                }
            })
            .catch(function () {
                alert('The error occurred. Please try again from the beginning.');
            });
    };

    // 알레르기 선택 토글
    const toggleAllergy = (allergy: string) => {
        setSelectedAllergies(prev =>
            prev.includes(allergy) ? prev.filter(item => item !== allergy) : [...prev, allergy]
        );
    };

    // 검색에 입력시 상태 업데이트트
    const AllergiesSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllergiesSearch(e.target.value);
    };


    //검색창 외 클릭시 드롭다운 숨김
    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && e.target instanceof Node && !inputRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };


    // 검색어에 따라 필터링된 알레르기 리스트

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const filteredAllergies = AllergiesSearch
        ? allAllergies.filter(allergy => allergy.toLowerCase().includes(AllergiesSearch.toLowerCase()))
            .sort()
        : allAllergies.sort();

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-10 flex-grow'>
            <h1 className="text-xl font-bold mb-4">Please select your allergy</h1>

            <div className="relative z-100" ref={inputRef}>
                <label htmlFor="AllergiesSearch" className="flex auth-input-label items-center">
                    <input
                        id="AllergiesSearch"
                        name="AllergiesSearch"
                        type="text"
                        placeholder="Search All your Allergies"
                        className="auth-placeholder grow text-left"
                        value={AllergiesSearch}
                        onChange={AllergiesSearchChange}
                        onFocus={() => setShowDropdown(true)} // 포커스 시 드롭다운 표시
                    />
                    <button type="button" className="flex items-center justify-center">
                        {/* 검색 아이콘 */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.4999 14H14.7099L14.4299 13.73C15.6299 12.33 16.2499 10.42 15.9099 8.39002C15.4399 5.61002 13.1199 3.39002 10.3199 3.05002C6.08989 2.53002 2.52989 6.09001 3.04989 10.32C3.38989 13.12 5.60989 15.44 8.38989 15.91C10.4199 16.25 12.3299 15.63 13.7299 14.43L13.9999 14.71V15.5L18.2499 19.75C18.6599 20.16 19.3299 20.16 19.7399 19.75C20.1499 19.34 20.1499 18.67 19.7399 18.26L15.4999 14ZM9.49989 14C7.00989 14 4.99989 11.99 4.99989 9.50002C4.99989 7.01002 7.00989 5.00002 9.49989 5.00002C11.9899 5.00002 13.9999 7.01002 13.9999 9.50002C13.9999 11.99 11.9899 14 9.49989 14Z" fill="#5A6E8C" />
                        </svg>
                    </button>
                </label>
                {showDropdown && filteredAllergies.length > 0 ? (
                    <div className="relative  max-h-60 overflow-y-auto mt-0 rounded-lg bg-[#F1F3F6] shadow-lg border border-[#E0E0E0] z-10">
                        <ul>
                            {filteredAllergies.map((allergy) => (
                                <li
                                    key={allergy}
                                    className="px-4 py-2 hover:bg-[#E0E0E0] cursor-pointer
                                    w-100"
                                    onClick={() => {
                                        toggleAllergy(allergy);
                                    }}
                                >
                                    {allergy}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>

            {/* 버튼들을 나열 */}
            <div className="button-toggle-container flex flex-col gap-[1rem]" >
                <div>
                    <h1 className='allergies-title text-left gap-[0.75rem]'>Fruits</h1>
                </div>
                <div className='dropdown-badge-container '>
                    {fruitAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem]'>Sea Food</h1>
                <div className='dropdown-badge-container'>
                    {seaFoodAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem]'>Nuts & Seeds</h1>
                <div className='dropdown-badge-container'>
                    {nutsAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem] w-full'>Meat & Dairy</h1>
                <div className='dropdown-badge-container'>
                    {meatAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <div className="button-toggle-container flex flex-wrap gap-[1rem]">
                <h1 className='allergies-title text-left gap-[0.75rem] w-full'>ETC</h1>
                <div className="dropdown-badge-container">
                    {etcAllergieList.map((allergie) => (
                        <button
                            type='button'
                            key={allergie}
                            onClick={() => toggleAllergy(allergie)}
                            className={`allergies-button
                            ${selectedAllergies.includes(allergie)
                                    ? "dropdown-badge-red "
                                    : "dropdown-badge-none"
                                }`}
                        >
                            {allergie}
                        </button>
                    ))}
                </div>
            </div>
            <button className='auth-button auth-button-id sign-up-button-text'
                type='submit'
            >Next
            </button>
        </form >
    );
}