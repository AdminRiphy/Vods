// Replace with your YouTube Data API key
//var apiKey = "AIzaSyASaJMxwF19QpFLWha7S7_qdPCMreP5EzQ";

// Replace with the channel ID of the YouTube channel
//var channelId = "UCcnThNtJW6qwV0w0blR_rQQ";

// Replace with your YouTube Data API key
var apiKey = "AIzaSyAhq90kc639Fl-tFoqxZsiU16rcpbNu3Ew";

// Replace with the channel ID of the YouTube channel
var channelId = "UCfCBoVmFjGsKOSt3JKZwo_Q";



// API request to retrieve video details
var url =
  "https://www.googleapis.com/youtube/v3/search?key=" +
  apiKey +
  "&channelId=" +
  channelId +
  "&part=snippet,id&maxResults=10";

  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    var videos = data.items;
    var videosContainer = document.getElementById("videos-container");

    // Check if videos array is empty
    if (videos.length === 0) {
      var messageElement = document.createElement("div");
      messageElement.textContent = "No streams were to be found...";
      videosContainer.appendChild(messageElement);
      return;
    }

    // Retrieve video details for each video
    Promise.all(
      videos.map((video) => {
        if (video.id.videoId) {
          var videoId = video.id.videoId;

          // Retrieve video details and duration
          return fetch(
            "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" + videoId + "&key=" + apiKey
          )
            .then((response) => response.json())
            .then((data) => {
              var videoData = data.items[0];
              var title = videoData.snippet.title;
              var thumbnailUrl = videoData.snippet.thumbnails.standard.url;
              var duration = parseDuration(videoData.contentDetails.duration);
              var uploadedAt = calculateTimeSinceUpload(
                videoData.snippet.publishedAt
              );

              // Create filter wrap
              var wrapElement = document.createElement("div");
              wrapElement.className = "filter-wrap";

              // Create card
              var cardElement = document.createElement("div");
              cardElement.className = "card";
              cardElement.addEventListener("click", function() {
                playVideo(videoId);
              });

              // Create card content
              var cardContentElement = document.createElement("div");
              cardContentElement.className = "card-content";

              // Create thumbnail
              var thumbnailElement = document.createElement("div");
              thumbnailElement.className = "thumbnail";

              // Create card info
              var cardInfoElement = document.createElement("div");
              cardInfoElement.className = "card-info";

              // Create thumbnail image
              var thumbnailImage = document.createElement("img");
              thumbnailImage.className = "thumbnailImage";
              thumbnailImage.src = thumbnailUrl;

              // Create title element
              var titleElement = document.createElement("div");
              titleElement.className = "title";
              titleElement.textContent = title;

              // Create duration element
              var durationElement = document.createElement("div");
              durationElement.className = "duration";
              durationElement.textContent = duration;

              // Create upload time element
              var uploadedAtElement = document.createElement("div");
              uploadedAtElement.className = "date-uploaded";
              uploadedAtElement.textContent = uploadedAt;

              // Append elements
              thumbnailElement.appendChild(thumbnailImage);
              thumbnailElement.appendChild(durationElement);
              thumbnailElement.appendChild(uploadedAtElement);

              cardInfoElement.appendChild(titleElement);

              cardContentElement.appendChild(thumbnailElement);
              cardContentElement.appendChild(cardInfoElement);

              cardElement.appendChild(cardContentElement);

              wrapElement.appendChild(cardElement);

              videosContainer.appendChild(wrapElement);
            })
            .catch((error) => console.log(error));
        }
      })
    );
  })
  .catch((error) => console.log(error));

function playVideo(videoId) {
  // Redirect to the video player page with the selected video ID
  window.location.href = "video.html?id=" + videoId;
}

// Function to parse video duration from ISO 8601 format to hh:mm:ss
function parseDuration(duration) {
  var matches = duration.match(/[0-9]+[HMS]/g);
  var hours = 0;
  var minutes = 0;
  var seconds = 0;
  matches.forEach((match) => {
    var unit = match.charAt(match.length - 1);
    var value = match.substring(0, match.length - 1);
    switch (unit) {
      case "H":
        hours = parseInt(value);
        break;
      case "M":
        minutes = parseInt(value);
        break;
      case "S":
        seconds = parseInt(value);
        break;
      default:
        break;
    }
  });
  return formatTime(hours, minutes, seconds);
}

// Function to format time as hh:mm:ss
function formatTime(hours, minutes, seconds) {
  var formattedTime = "";
  if (hours < 10) {
    formattedTime += "0" + hours;
  } else {
    formattedTime += hours;
  }
  formattedTime += ":";
  if (minutes < 10) {
    formattedTime += "0" + minutes;
  } else {
    formattedTime += minutes;
  }
  formattedTime += ":";
  if (seconds < 10) {
    formattedTime += "0" + seconds;
  } else {
    formattedTime += seconds;
  }
  return formattedTime;
}

// Function to calculate time since video upload
function calculateTimeSinceUpload(publishedAt) {
  var now = new Date();
  var uploadDate = new Date(publishedAt);
  var diff = now - uploadDate;
  var minutes = Math.floor(diff / (1000 * 60));
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);
  var years = Math.floor(months / 12);

  if (years > 0) {
    return years + " years ago";
  } else if (months > 0) {
    return months + " months ago";
  } else if (days > 0) {
    return days + " days ago";
  } else if (hours > 0) {
    return hours + " hours ago";
  } else if (minutes > 0) {
    return minutes + " minutes ago";
  } else {
    return "Less than a minute ago";
  }
}

function playVideo(videoId) {
  // Redirect to the video player page with the selected video ID
  window.location.href = "video.html?id=" + videoId;
}
