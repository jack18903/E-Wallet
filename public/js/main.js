//------------------Đăng kí------------------
const firebaseConfig = {
    apiKey: "AIzaSyClgG29t_WinazJCO-Z5gAm5_M59m_Vbqg",
    authDomain: "ewallet-c3233.firebaseapp.com",
    projectId: "ewallet-c3233",
    storageBucket: "ewallet-c3233.appspot.com",
    messagingSenderId: "978899555440",
    appId: "1:978899555440:web:02191d1dee0193c8e5d0b5"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function register() {
    const user = {
        'phone': $('#phone').val(),
        'email': $('#email').val(),
        'fullname': $('#fullname').val(),
        'address': $('#address').val(),
        'birthday': $('#birthday').val(),
        'cmndfront': '',
        'cmndback': ''
    }

    const ref = firebase.storage().ref();
    //chứng minh nhân dân trước
    const cmndfront = document.querySelector("#cmndfront").files[0];
    const cmndback = document.querySelector("#cmndback").files[0];


    if (cmndfront == null || cmndback == null) {
        $.ajax({
            url: '/auth/register',
            type: 'post',
            data: {
                user: user
            }
        }).then(data => {
            if (data.success) {
                alert(data.msg)
                window.location.href = '/auth/login';
            }
            else {
                alert(data.msg)
            }
        })
    } else {
        const cmndfrontName = +new Date() + "-" + cmndfront.name;
        const cmndfrontMetadata = {
            contentType: cmndfront.type
        };
        const cmndbackName = +new Date() + "-" + cmndback.name;
        const cmndbackMetadata = {
            contentType: cmndback.type
        };



        const task1 = ref.child(cmndfrontName).put(cmndfront, cmndfrontMetadata);
        //chứng minh nhân dân sau
        const task2 = ref.child(cmndbackName).put(cmndback, cmndbackMetadata);




        //run task
        task1
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                task2
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(url2 => {
                        user.cmndfront = url
                        user.cmndback = url2
                        $.ajax({
                            url: '/auth/register',
                            type: 'post',
                            data: {
                                user: user
                            }
                        }).then(data => {
                            if (data.success) {
                                alert(data.msg)
                                window.location.href = '/auth/login';
                            }
                            else {
                                alert(data.msg)
                            }
                        })
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }

}

//------------------Đăng nhập------------------
function login() {
    $.ajax({
        url: '/auth/login',
        type: 'post',
        data: {
            username: $('#username').val(),
            password: $('#password').val(),
        }
    }
    ).then(data => {
        if (data.success) {
            alert(data.msg)
            setCookie('token', data.token, 1);
            window.location.href = "/"
        } else {
            alert(data.msg)
            window.location.href = "/"
        }

    }).catch(err => {
        console.log(err)
    })
}

//hàm get set cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function logout() {
    $.ajax({
        url: '/auth/logout',
        type: 'post',
    }
    ).then(data => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"
    }).catch(err => {
        console.log(err)
    })
}


//------------------Đổi password cho đăng nhập lần đầu------------------
function changePassword(username) {
    const password = $('#password').val();
    const password2 = $('#password2').val();
    if (password != password2 && (password != null && password2 != null)) {
        alert("Mật khẩu của bạn không hợp lệ ! Vui lòng thử lại !")
    } else {
        $.ajax({
            url: '/auth/changePassword',
            type: 'post',
            data: {
                password: password,
                username: username
            }
        }
        ).then(data => {
            if (data.success) {
                alert(data.msg)
                setTimeout(function () {
                }, 1000);
                window.location.href = "/"
            } else {
                alert(data.msg)
            }

        }).catch(err => {
            console.log(err)
        })
    }
}


