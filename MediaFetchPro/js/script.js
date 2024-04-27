//loader
window.addEventListener("load", function () {
  setTimeout(function () {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none";
  }, 3000); // 3000 milliseconds = 3 seconds
});


document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const navbarContainer = document.querySelector('.navbar');

    menuIcon.addEventListener('click', () => {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        navbarContainer.style.display = 'flex';
    });

    closeIcon.addEventListener('click', () => {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        navbarContainer.style.display = 'none';
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                });
                targetSection.style.display = 'flex';
            }
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            navbarContainer.style.display = 'none';
        });
    });

    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.style.display = 'flex';
    }

    document.querySelectorAll('.section').forEach(section => {
        if (section !== homeSection) {
            section.style.display = 'none';
        }
    });

    //--------------------------------------------------TikTok Downloader--------------------------------------------------
    const ttdlForm = document.getElementById('ttdlForm');

    ttdlForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const videoUrlInput = ttdlForm.querySelector('input[name="url"]');
        const videoUrl = videoUrlInput.value.trim();
        if (videoUrl) {
            try {
                const apiUrl = `https://deku-rest-api.replit.app/tiktokdl?url=${encodeURIComponent(videoUrl)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (data.result) {
                    console.log('TikTok video download URL:', data.result);
                    const videoDataResponse = await fetch(data.result);
                    const videoDataBlob = await videoDataResponse.blob();
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(videoDataBlob);
                    downloadLink.download = 'tiktok_video.mp4';
                    downloadLink.click();
                } else {
                    console.error('TikTok video download error:', data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        } else {
            console.error('Please enter a  Valid TikTok URL');
        }
    });
    
    //--------------------------------------------------Image Downloader--------------------------------------------------
    const fileInput = document.getElementById("filedl-input");
    const fileDownloadBtn = document.getElementById("file-download-btn"); 

    fileDownloadBtn.addEventListener("click", e => {
        e.preventDefault();
        fileDownloadBtn.innerText = "Downloading Image...";
        fetchFile(fileInput.value);
    });

    function fetchFile(url) {
        fetch(url)
            .then(res => res.blob())
            .then(file => {
                let tempUrl = URL.createObjectURL(file);
                const aTag = document.createElement("a");
                aTag.href = tempUrl;
                aTag.download = url.substring(url.lastIndexOf('/') + 1); 
                document.body.appendChild(aTag);
                aTag.click();
                fileDownloadBtn.innerText = "Download Image";
                URL.revokeObjectURL(tempUrl);
                aTag.remove();
            })
            .catch(() => {
                alert("Failed to download image!");
                fileDownloadBtn.innerText = "Download Image";
            });
    }
});

//--------------------------------------------------YouTube Downloader--------------------------------------------------
function download() {
    let link = document.getElementById('link').value;
    let format = document.getElementById('format').value;

    if (link != "") {
        let url;
        if (link.includes("https://youtu.be/")) {
            url = link.replace("https://youtu.be/", "https://www.youtube.com/embed/");
        } else if (link.includes("https://www.youtube.com/watch?v=")) {
            url = link.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
        } else if (link.includes("https://youtube.com/shorts/")) {
            url = link.replace("https://youtube.com/shorts/", "https://www.youtube.com/embed/").replace("?feature=share", "");
        }

        if (url) {
            let downloadUrl = `https://loader.to/api/button/?url=${encodeURIComponent(link)}&f=${format}`;
            let iframe = `<iframe style="width: 100%; height: 50px; border: hidden; overflow: hidden; outline: none;" scrolling="no" src="${downloadUrl}"></iframe>`;
            document.querySelector('.result2').innerHTML = iframe;
        } else {
            alert("Invalid YouTube video link!");
        }
    } else {
        alert("Please enter a Valid YouTube video link!");
    }
}


function Get() {
    let youtubeUrl = document.getElementById('youtubeUrl').value.trim();
    
    if (!isValidUrl(youtubeUrl)) {
        alert('Please enter a Valid YouTube URL.');
        return;
    }
    
    let videoID = getVideoID(youtubeUrl);
    if (!videoID) {
        alert('Unable to download video ID from the URL.');
        return;
    }
    
    downloadMusic(videoID);
}

function isValidUrl(url) {
    let regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?.*v=|.*\/v\/|embed\/|v\/))?([\w\-]{11})(\&.*)?$/;
    return regex.test(url);
}

function getVideoID(url) {
    let match = url.match(/(?:v=|\/)([\w\-]{11})(?:\S+)?$/);
    return match ? match[1] : null;
}

function downloadMusic(videoID) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '2b929025ddmshd3302ab633a818cp1ab4cdjsne14ca95e2a8d',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    };

    let urlLink = 'https://youtube-mp36.p.rapidapi.com/dl?id=' + videoID;
    fetch(urlLink, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network is taking too long to respond. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const downloadLink = data.link;
            const anchor = document.createElement("a");
            anchor.href = downloadLink;
            anchor.download = 'MWC.mp3';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        })
        .catch(err => console.error('Error downloading music:', err));
}


//--------------------------------------------------Facebook Downloader--------------------------------------------------
async function GetReels() {
    let url = document.getElementById('fbUrl').value.trim(); 
    let reelId = extractReelId(url);
    let apiUrl = "https://deku-rest-api.replit.app/facebook?url=https://web.facebook.com/reel/" + reelId;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch video URL. Please check your URL and try again.');
        }

        const responseData = await response.json(); 

        const videoUrl = responseData.result;

        if (!videoUrl) {
            throw new Error('Video URL not found in the response. Please check your URL and try again.');
        }

        downloadVideo( videoUrl );
        
        document.getElementById('fbUrl').value = "";
    } catch (error) {
        console.error('Error fetching video:', error);
        alert(error.message);
    }
}

function downloadVideo(videoUrl) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; 
    const proxiedUrl = proxyUrl + videoUrl;

    fetch(proxiedUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'facebook_video.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading video:', error);
            alert('Error downloading video. Please try again.');
        });
}

function extractReelId(url) {
    let parts = url.split('/');
    return parts[parts.length - 1];
}
