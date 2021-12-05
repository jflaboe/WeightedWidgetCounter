import React, { useState, useEffect } from 'react'

const AUTH_URL_BASE = "https://id.twitch.tv/oauth2/authorize"
const USER_INFO_URL = 'https://id.twitch.tv/oauth2/userinfo'
const REDIRECT_URI = "https://widget.fendull.com";
const CLIENT_ID = "r00l5bbti7hghk2rwaaq84p08dxh93";


function setCookie(cname, cvalue, expires) {
    document.cookie = cname + "=" + cvalue + ";" + expires.toString() + ";path=/";
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


function delete_cookie( name, path, domain ) {
    if( getCookie( name ) ) {
      document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ((domain)?";domain="+domain:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

export default function TwitchAuth(props) {
    const [authorized, setAuthorized] = useState(false);
    const [idToken, setIdToken] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [idToken64, setIdToken64] = useState(null)

    function reset(){
        setAuthorized(false);
        delete_cookie("access_token", "/", "widget.fendull.com")
        delete_cookie("id_token", "/", "widget.fendull.com")
    }
    function checkCookies(){
        var access_token = getCookie('access_token');
        if (access_token === ''){
            return
        } else {
            setAccessToken(access_token)
            setIdToken64(getCookie('id_token'))
            setIdToken(parseJwt(getCookie('id_token')))
            setAuthorized(true)
        }
    }
    function checkURL(){
        if (window.location.hash.length > 0){
            var url = new URLSearchParams('?' + window.location.hash.substr(1));
            var access_token = url.get('access_token');
            if (access_token !== '') {
                
                var id_token = url.get('id_token');
                var id_token_object = parseJwt(id_token);
                
                setIdToken(id_token_object)
                setIdToken64(id_token)
                setCookie('id_token', id_token, id_token_object.exp)
                setCookie("access_token", access_token, id_token_object.exp)
                setAccessToken(access_token);
                setAuthorized(true)
            } else {
                checkCookies();
            }
        } else {
            checkCookies();
        }  
    }

    useEffect(()=>{
        checkURL()
    }, [])
    
    function buildURL(){
        return encodeURI(`${AUTH_URL_BASE}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid&response_type=token+id_token&claims={"user_info":{"preferred_username":null,"picture":null}}`)
    }

    const AUTH_URL = buildURL();
    const authData = {authUrl: AUTH_URL, authorized: authorized, accessToken: accessToken, idToken: idToken, idToken64: idToken64, userInfoUrl: USER_INFO_URL, reset: reset};
    
    return (
        <React.Fragment>
            {React.Children.toArray(props.children).map((child) =>{
                return React.cloneElement(child, {authData: authData})
            })}
        </React.Fragment>
    )
}