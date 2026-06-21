import {
  useState,
  useEffect,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
function Chat() {
  useEffect(() => {
  Notification.requestPermission();
}, []);
useEffect(() => {
  socket.on("connect", () => {
    console.log(
      "Connected:",
      socket.id
    );

    socket.emit(
      "register_user",
      user.username
    );
  });

  return () => {
    socket.off("connect");
  };
}, []);
useEffect(() => {
  fetch("https://realtime-chat-app-production-e26c.up.railway.app/messages"
)
    .then((res) => res.json())
    .then((data) => {
      setMessages(data);
    })
    .catch((err) => {
      console.log("Error loading messages", err);
    });
}, []);
useEffect(() => {
  fetch("https://realtime-chat-app-production-e26c.up.railway.app/users")
    .then((res) => res.json())
    .then((data) => {
      setUsers(data);
    })
    .catch((err) => {
      console.log(
        "Error loading users",
        err
      );
    });
}, []);

useEffect(() => {
  socket.on("receive_message", (data) => {
  console.log("Received:", data);

  setMessages((prev) => [
  ...prev,
  {
    text: data.text,
    image: data.image,
    sender: data.sender,
    receiver: data.receiver,
    time: data.time,
  },
]);

  if (
    !selectedUser ||
    selectedUser.username !== data.sender
  ) {
    setUnreadMessages((prev) => ({
      ...prev,
      [data.sender]:
        (prev[data.sender] || 0) + 1,
    }));
  }
});

  return () => {
    socket.off("receive_message");
  };
}, [selectedUser]);
useEffect(() => {
  socket.on("online_users", (count) => {
  setOnlineUsers(count);
  setIsOnline(count > 0);
});

  return () => {
    socket.off("online_users");
  };
}, []);
useEffect(() => {
  socket.on("user_typing", () => {
    setOtherTyping(true);

    setTimeout(() => {
      setOtherTyping(false);
    }, 1000);
  });

  return () => {
    socket.off("user_typing");
  };
}, []);

useEffect(() => {
  socket.on(
    "message_deleted",
    (messageId) => {
      setMessages((prev) =>
        prev.filter(
          (msg) =>
            msg._id !== messageId
        )
      );
    }
  );

  return () => {
    socket.off(
      "message_deleted"
    );
  };
}, []);
useEffect(() => {
  socket.on(
    "reaction_updated",
    (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === data.sender &&
          msg.text === data.text &&
          msg.time === data.time
            ? {
                ...msg,
                reaction:
                  data.reaction,
              }
            : msg
        )
      );
    }
  );

  return () => {
    socket.off(
      "reaction_updated"
    );
  };
}, []);
useEffect(() => {
  socket.on(
    "message_seen_update",
    (data) => {
      console.log(
        "SEEN UPDATE RECEIVED",
        data
      );

      setMessages((prev) => {
        console.log(
          "MESSAGES BEFORE",
          prev
        );

        return prev.map((msg) =>
          msg.sender ===
          user.username
            ? {
                ...msg,
                status:
                  "Seen",
              }
            : msg
        );
      });
    }
  );

  return () => {
    socket.off(
      "message_seen_update"
    );
  };
}, []);
  const navigate = useNavigate();
  useEffect(() => {
  const loggedIn =
    localStorage.getItem(
      "isLoggedIn"
    );

  if (
    !loggedIn
  ) {
    navigate("/");
  }
}, []);

  const [message, setMessage] = useState("");
  const [
  selectedImage,
  setSelectedImage
] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastSeen, setLastSeen] =
  useState("");
  const [users, setUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] =
  useState({});
  const [selectedUser, setSelectedUser] =
  useState(null);
  const user = JSON.parse(
  localStorage.getItem("user")
);
  const [
  unreadCount,
  setUnreadCount
] = useState(0);
  const [editingIndex, setEditingIndex] =
  useState(null);
  const [typing, setTyping] = useState(false);
  const [
  otherTyping,
  setOtherTyping
] = useState(false);
  const [darkMode,
setDarkMode]
= useState(
  JSON.parse(
    localStorage.getItem(
      "darkMode"
    )
  ) ?? true
);
  const [isOnline,
setIsOnline] =
useState(true);
const [onlineUsers, setOnlineUsers] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [
  selectedMessages,
  setSelectedMessages
] = useState([]);
  const [
  showSettings,
  setShowSettings
] = useState(false);
const [
  showProfile,
  setShowProfile
] = useState(false);
const [
  fullImage,
  setFullImage
] = useState(null);
const [
  zoomLevel,
  setZoomLevel
] = useState(1);
const [
  toast,
  setToast
] = useState("");
const [
  loading,
  setLoading
] = useState(true);
const [
  profileName,
  setProfileName
] = useState(
  localStorage.getItem(
    "profileName"
  ) || "Realtime User"
);

const [
  profilePic,
  setProfilePic
] = useState(
  localStorage.getItem(
    "profilePic"
  ) ||
    "https://i.pravatar.cc/150?img=32"
);
  const [replyMessage,
setReplyMessage] =
useState(null);
const [bgImage,
setBgImage] =
useState(1);
const [
  customBg,
  setCustomBg
] = useState("");
  const chatEndRef = useRef(null);
  const inputRef =
  useRef(null);
  const notificationSound =
  new Audio(
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
  );
  useEffect(() => {
  if (!selectedUser) return;

  fetch(
    `https://realtime-chat-app-production-e26c.up.railway.app/user/${selectedUser.username}
`
  )
    .then((res) =>
      res.json()
    )
    .then((data) => {
      if (
        data.lastSeen
      ) {
        const date =
          new Date(
            data.lastSeen
          );

        setLastSeen(
          date.toLocaleString()
        );
      }
    })
    .catch((err) =>
      console.log(err)
    );
}, [selectedUser]);

useEffect(() => {
  localStorage.setItem(
    "darkMode",
    JSON.stringify(
      darkMode
    )
  );
}, [darkMode]);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({
  behavior: "smooth",
  block: "end",
});
}, [messages]);
useEffect(() => {
  inputRef.current
    ?.focus();
}, []);

useEffect(() => {
  localStorage.setItem(
    "profileName",
    profileName
  );
}, [profileName]);

useEffect(() => {
  localStorage.setItem(
    "profilePic",
    profilePic
  );
}, [profilePic]);
useEffect(() => {
  setTimeout(() => {
    setLoading(false);
  }, 2000);
}, []);

const exportChat = () => {
  const chatText =
    messages
      .map(
        (msg) =>
          `${
            msg.sender
          }: ${
            msg.text ||
            "Image"
          }`
      )
      .join("\n");

  const blob =
    new Blob(
      [chatText],
      {
        type:
          "text/plain",
      }
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    URL.createObjectURL(
      blob
    );

  link.download =
    "chat.txt";

  link.click();
};
const showToast = (
  text
) => {
  setToast(text);

  setTimeout(() => {
    setToast("");
  }, 2000);
};

  const sendMessage = () => {
    if (!selectedUser) {
  alert(
    "Please select a user first"
  );
  return;
}
    if (!message.trim()) {
  showToast(
  "⚠️ Type a message first!"
);
  return;
}
    if (message.trim() !== "") {
      if (editingIndex !== null) {
  const updatedMessages = [
    ...messages,
  ];

  updatedMessages[
    editingIndex
  ].text = message;
  updatedMessages[
  editingIndex
].edited = true;

  setMessages(updatedMessages);
  setEditingIndex(null);
} else {
  setMessages([
    ...messages,
    {
  text: message,
  reply: replyMessage,
  sender: user.username,
  receiver: selectedUser.username,
  status: "Delivered",
      reaction: "",
      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
    },
  ]);
  socket.emit("send_message", {
  text: message,
  sender: user.username,
  receiver: selectedUser?.username,
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});
  setTimeout(() => {
  setMessages(
    (prev) =>
      prev.map(
        (
          msg,
          i
        ) =>
          i ===
          prev.length -
            1
            ? {
                ...msg,
                status:
                  "Sent",
              }
            : msg
      )
  );
}, 1000);
}
      setMessage("");
      setOtherTyping(
  true
);
setReplyMessage(
  null
);
setTyping(false);
setOtherTyping(
  true
);
    }
  };
if (loading) {
  return (
    <div className="loading-screen">
      <h1>
        Realtime Chat
      </h1>

      <p>
        Loading...
      </p>
    </div>
  );
}
  return (
    <div
  className={
    darkMode
      ? "chat-container dark"
      : "chat-container light"
  }
  style={{
  backgroundImage:
  customBg
    ? `url(${customBg})`
    : bgImage === 1
      ? "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200')"
      : "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200')",
  backgroundSize:
    "cover",
}}
>
  <h3>Welcome, {user?.username}</h3>
  <h4>Users</h4>

{users
  .filter(
    (u) =>
      u.username !==
      user?.username
  )
  .map((u) => (
  <p
    key={u._id}
    onClick={() => {
  setSelectedUser(u);
 console.log("SEEN EVENT SENT");
  socket.emit(
  "message_seen",
  {
    sender:
      u.username,
    receiver:
      user.username,
  }
);

  setUnreadMessages(
  (prev) => ({
    ...prev,
    [u.username]: 0,
  })
);

  fetch(
    `https://realtime-chat-app-production-e26c.up.railway.app/messages/${user.username}/${u.username}`
  )
    .then((res) => res.json())
    .then((data) => {
      setMessages(data);
    })
    .catch((err) => {
      console.log(err);
    });
}}
    style={{
      cursor: "pointer",
      fontWeight:
        selectedUser?._id ===
        u._id
          ? "bold"
          : "normal",
    }}
  >
    {u.username}

{unreadMessages[
  u.username
] > 0 && (
  <span
    style={{
      color: "black",
      marginLeft: "8px",
    }}
  >
    (
    {
      unreadMessages[
        u.username
      ]
    }
    )
  </span>
)}
  </p>
))}
{selectedUser && (
  <h4>
    Chatting with:
    {selectedUser.username}
  </h4>
)}
      <div className="logout-container">
  <button
    className="logout-btn"
    onClick={() => {
  localStorage.removeItem("isLoggedIn");
localStorage.removeItem("user");
  navigate("/");
}}
  >
    Logout
  </button>
  <div
  style={{
    position:
      "relative",
    display: "inline-block",
    marginLeft: "10px",
  }}
>
  <button
    className="menu-btn"
    onClick={() =>
      setShowSettings(
        !showSettings
      )
    }
  >
    ⋮
  </button>

  {showSettings && (
    <div className="settings-popup">

      <p
        onClick={() => {
          setMessages([]);
          setShowSettings(
            false
          );
        }}
      >
         New Chat
      </p>

      <p
        onClick={() => {
          const confirmClear =
  window.confirm(
    "Are you sure to clear chat?"
  );

if (
  confirmClear
) {
  setMessages(
    []
  );
}

          setShowSettings(
            false
          );
        }}
      >
         Clear Chat
      </p>

      <p
        onClick={() => {
          exportChat();
          setShowSettings(
            false
          );
        }}
      >
         Export Chat
      </p>

      <label
        style={{
          cursor:
            "pointer",
          display:
            "block",
        }}
      >
         Change Wallpaper
        <input
          type="file"
          accept="image/*"
          style={{
            display:
              "none",
          }}
          onChange={(
            e
          ) => {
            const file =
              e.target
                .files[0];

                if (!file) {
  showToast(
    "❌ No image selected"
  );
  return;
}

            if (
              file
            ) {
              setCustomBg(
                URL.createObjectURL(
                  file
                )
              );
            }

            setShowSettings(
              false
            );
          }}
        />
      </label>

    </div>
  )}
</div>
</div>

      <div className="chat-header">
  <div className="profile-section">
    <img
  className="profile-pic"
 onClick={() =>
  setShowProfile(
    !showProfile
  )
}
  src={profilePic}
  alt="profile"
/>
    <div>
      <h2>
  {profileName}
({messages.length})

{unreadCount >
0 && (
  <span>
    🔴 {
      unreadCount
    }
  </span>
)}
</h2>
     <p className="status">
  <span className="online-dot"></span>
  Online ({onlineUsers})
 <p className="last-seen">
  Last seen:
  {lastSeen}
</p>
</p>
    </div>
  </div>
  {showProfile && (
  <div className="profile-popup">
    <img
  src={profilePic}
      alt="profile"
      className="popup-profile-pic"
    />

    <h3>
  {profileName}
</h3>
<input
  type="text"
  placeholder="New Name"
  onChange={(e) =>
    setProfileName(
      e.target.value
    )
  }
/>
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file =
      e.target.files[0];

    if (file) {
      setProfilePic(
        URL.createObjectURL(
          file
        )
      );
    }
  }}
/>

<button
  onClick={() =>
    setShowProfile(false)
  }
>
  Close
</button>
  </div>
)}
  <button
  className="theme-btn"
  onClick={() =>
    setDarkMode(!darkMode)
  }
>
  {darkMode ? "☀️" : "🌙"}
</button>
</div>
      <div
  className={
    darkMode
      ? "chat-box dark-box"
      : "chat-box light-box"
  }
>
  {messages.length >
20 && (
  <button
    onClick={() =>
      alert(
        "Older messages coming soon 😄"
      )
    }
  >
    Load More
  </button>
)}
  <h3 style={{ textAlign: "center", color: "gray" }}>
  Welcome to Realtime Chat ✨
</h3>
{messages.some(
  (msg) =>
    msg.pinned
) && (
  <div
    style={{
      background:
        "#222",
      padding:
        "10px",
      borderRadius:
        "10px",
      marginBottom:
        "10px",
    }}
  >
    📌 Pinned:
    {
      messages.find(
        (msg) =>
          msg.pinned
      )?.text
    }
  </div>
)}
{messages.length === 0 && (
  <p
    style={{
      textAlign:
        "center",
      color: "gray",
    }}
  >
    Start chatting 
  </p>
)}
 {messages
  .filter(
    (msg) =>
      selectedUser &&
      (
        (msg.sender === user.username &&
         msg.receiver === selectedUser.username) ||

        (msg.sender === selectedUser.username &&
         msg.receiver === user.username)
      )
  )
  .slice(-20)
  .map((msg, index) => (
    <div
      key={index}
      onClick={() => {
  if (
    selectedMessages.includes(
      index
    )
  ) {
    setSelectedMessages(
      selectedMessages.filter(
        (i) =>
          i !== index
      )
    );
  } else {
    setSelectedMessages([
      ...selectedMessages,
      index,
    ]);
  }
}}
      onDoubleClick={() => {
  const updatedMessages =
    [...messages];

  updatedMessages[
    index
  ].reaction = "❤️";

  setMessages(
    updatedMessages
  );
}}
      className={`${
  msg.sender === user.username
    ? "message sender"
    : "message receiver"
} message-animation${
  selectedMessages.includes(
    index
  )
    ? "selected-msg"
    : ""
}`}

    >
      {msg.reply && (
  <div
    className="reply-preview"
  >
    {msg.reply}
  </div>
)}
{msg.pinned && (
  <small>
    📌 Pinned
  </small>
)}
{msg.starred && (
  <span>⭐</span>
)}
{msg.text?.startsWith(
  "↪️"
) && (
  <small>
    Forwarded
  </small>
)}
{msg.sender !== user.username && (
  <small className="sender-name">
    {msg.sender}
  </small>
)}
      <p className={msg.text === "Typing..." ? "typing-text" : ""}>
  {msg.image ? (
  <img
  src={msg.image}
  alt="chat"
  className="chat-image"
  onClick={() => {
  if (msg.image) {
    setFullImage(
      msg.image
    );
  } else {
    showToast(
      "❌ Image not found"
    );
  }
}}
/>
) : (
  msg.text
)}
</p>

      <small
  title={
    new Date().toLocaleString()
  }
>
  {msg.time}
  {msg.edited &&
    " (edited)"}
</small>
      {msg.sender === user.username && (
  <small
    style={{
      color:
        msg.status === "Seen"
          ? "dodgerblue"
          : "gray",
      display: "block",
      marginTop: "4px",
    }}
  >
    ✔✔ {msg.status}
  </small>
)} 
<div className="menu-container">
    {msg.reaction && (
  <span className="reaction-badge">
    {msg.reaction}
  </span>
)}
  <button
    className="menu-btn"
    title="More options"
    onClick={() =>
      setActiveMenu(
        activeMenu === index
          ? null
          : index
      )
    }
  >
    ⋮
  </button>

  {activeMenu === index && (
    <div className="menu-options">
      <button
  onClick={() => {
    setReplyMessage(
      msg.text
    );
    setActiveMenu(null);
  }}
>
  ↩️ Reply
</button>

<button
  onClick={() => {
    if (msg.text) {
  navigator.clipboard.writeText(
    msg.text
  );

  showToast(
    "📋 Message copied!"
  );
} else {
  showToast(
    "❌ Nothing to copy"
  );
}

    showToast(
  "📋 Message copied!"
);

    setActiveMenu(null);
  }}
>
  📋 Copy
</button>
<button
  onClick={() => {
    const updatedMessages =
      [...messages];

    updatedMessages[
      index
    ].pinned = true;

    setMessages(
      updatedMessages
    );

    setActiveMenu(null);
  }}
>
  📌 Pin
</button>
      <button
        onClick={() => {
          setMessage(msg.text);
          setEditingIndex(index);
          setActiveMenu(null);
        }}
      >
        ✏️ Edit
      </button>

      <button
  onClick={async () => {
    const confirmDelete =
      window.confirm(
        "Delete this message?"
      );

   if (confirmDelete) {
  try {
    console.log("Deleting message:", msg);
console.log("Message ID:", msg._id);
    await fetch(
      `https://realtime-chat-app-production-e26c.up.railway.app/delete-message/${msg._id}`,
      {
        method: "DELETE",
      }
    );
    socket.emit(
  "delete_message",
  msg._id
);

   setMessages((prev) =>
  prev.filter(
    (m) => m._id !== msg._id
  )
);
  } catch (err) {
    console.log(
      "Delete failed",
      err
    );
  }
}

    setActiveMenu(null);
  }}
>
  🗑️ Delete
</button>
      <button
  onClick={() => {
    const updatedMessages =
      [...messages];

    updatedMessages[
      index
    ].starred =
      !updatedMessages[
        index
      ].starred;

    setMessages(
      updatedMessages
    );

    setActiveMenu(null);
  }}
>
  ⭐ Star
</button>
<button
  onClick={() => {
    setMessages([
      ...messages,
      {
        text:
          "↪️ " +
          msg.text,
        sender: user.username,
        status:
          "Delivered",
        reaction: "",
        time:
          new Date().toLocaleTimeString(
  [],
  {
    hour:
      "2-digit",
    minute:
      "2-digit",
    hour12:
      true,
  }
)
      },
    ]);

    setActiveMenu(null);
  }}
>
  ↪️ Forward
</button>
      <div className="emoji-menu">
 <span
  onClick={() => {
    const updatedMessages = [...messages];

    const realIndex =
      messages.findIndex(
        (m) =>
          m.time === msg.time &&
          m.sender === msg.sender &&
          m.text === msg.text
      );

    if (realIndex !== -1) {
      updatedMessages[
        realIndex
      ].reaction = "❤️";
    }

    setMessages(
      updatedMessages
    );
    socket.emit(
  "reaction_added",
  {
    sender: msg.sender,
    text: msg.text,
    time: msg.time,
    reaction: "❤️",
  }
);

    setActiveMenu(null);
  }}
>
  ❤️
</span>

  <span
  onClick={() => {
    const updatedMessages = [...messages];

    const realIndex =
      messages.findIndex(
        (m) =>
          m.time === msg.time &&
          m.sender === msg.sender &&
          m.text === msg.text
      );

    if (realIndex !== -1) {
      updatedMessages[realIndex].reaction = "😂";
    }

    setMessages(updatedMessages);
    setActiveMenu(null);
  }}
>
  😂
</span>

  <span
  onClick={() => {
    const updatedMessages = [...messages];

    const realIndex =
      messages.findIndex(
        (m) =>
          m.time === msg.time &&
          m.sender === msg.sender &&
          m.text === msg.text
      );

    if (realIndex !== -1) {
      updatedMessages[realIndex].reaction = "🔥";
    }

    setMessages(updatedMessages);
    setActiveMenu(null);
  }}
>
  🔥
</span>

  <span
  onClick={() => {
    const updatedMessages = [...messages];

    const realIndex =
      messages.findIndex(
        (m) =>
          m.time === msg.time &&
          m.sender === msg.sender &&
          m.text === msg.text
      );

    if (realIndex !== -1) {
      updatedMessages[realIndex].reaction = "👍";
    }

    setMessages(updatedMessages);
    setActiveMenu(null);
  }}
>
  👍
</span>
</div>
    </div>
  )}
</div>
    </div>
  ))}

  <div ref={chatEndRef}></div>
  {fullImage && (
  <div
    className="image-viewer"
    onClick={() => {
  setFullImage(null);
  setZoomLevel(1);
}}
  >
  <div className="zoom-controls">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setZoomLevel(
        zoomLevel + 0.2
      );
    }}
  >
    ➕
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      setZoomLevel(
        Math.max(
          1,
          zoomLevel - 0.2
        )
      );
    }}
  >
    ➖
  </button>
</div>
    <img
  src={fullImage}
  alt="full"
  className="full-image"
  style={{
    transform: `scale(${zoomLevel})`,
    transition: "0.2s",
  }}
/>

    <a
      href={fullImage}
      download
      className="download-btn"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      ⬇️ Download
    </a>
  </div>
)}
{toast && (
  <div className="toast">
    {toast}
  </div>
)}
</div>
{typing && (
  <p style={{ color: "white" }}>
    Typing...
  </p>
)}
{otherTyping && (
  <p
    style={{
      color:
        "gray",
      marginLeft:
        "20px",
    }}
  >
    Realtime Chat
    is typing...
  </p>
)}
{otherTyping && (
  <p
    style={{
      color:
        "gray",
      fontStyle:
        "italic",
    }}
  >
    Typing...
  </p>
)}
{replyMessage && (
  <div
    className="reply-box"
  >
    Replying to:
    {replyMessage}

    <span
      onClick={() =>
        setReplyMessage(
          null
        )
      }
    >
      ✖
    </span>
  </div>
)}
      <div className="message-box">
        {selectedImage && (
  <div>
    <img
      src={
        selectedImage
      }
      alt="preview"
      style={{
        width:
          "120px",
      }}
    />
  </div>
)}
       <button
  className="voice-btn"
  onClick={() => {
  try {
    const recognition =
      new webkitSpeechRecognition();

    recognition.lang =
      "en-US";

    recognition.start();

    recognition.onresult =
  (event) => {
    console.log(
      "Speech Result:",
      event
    );

    const text =
      event.results[0][0]
        .transcript;

    console.log(
      "Recognized:",
      text
    );

    setMessage(text);
  };

    recognition.onerror =
  (event) => {
    console.log(
      "Speech Error:",
      event.error
    );

    alert(
      "Speech Error: " +
        event.error
    );
  };
  } catch {
    alert(
      "Browser mic not supported"
    );
  }
}}
>
  🎤
</button>
        <label className="image-upload">
  📷
  <input
    type="file"
    accept="image/*"
    hidden
    onChange={async (e) => {
  const file =
    e.target.files[0];

  if (!file) return;

  const formData =
    new FormData();

  formData.append(
    "image",
    file
  );

  try {
    const res =
      await fetch(
        "https://realtime-chat-app-production-e26c.up.railway.app/upload",
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await res.json();

      console.log(data);

    setMessages([
      ...messages,
      {
        image:
          data.imageUrl,
        sender:
          user.username,
        receiver:
          selectedUser?.username,
        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",
              minute:
                "2-digit",
            }
          ),
      },
    ]);
    socket.emit("send_message", {
  image: data.imageUrl,
  sender: user.username,
  receiver: selectedUser?.username,
  time: new Date().toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ),
});
  } catch (err) {
    console.log(
      "Upload failed",
      err
    );
  }
}}
  />
</label>
        <button
  className="emoji-btn"
  onClick={() => setMessage(message + "😊")}
>
  😊
</button>
        <input
  ref={inputRef}
  type="text"
  placeholder={
  replyMessage
    ? "Reply message..."
    : "Type a message..."
}
  value={message}
  onChange={(e) => {
  setMessage(e.target.value);
  setTyping(e.target.value.length > 0);

  socket.emit("typing");
}}
  onKeyDown={(e) => {
  if (
    e.key ===
    "Enter"
  ) {
    e.preventDefault();

    sendMessage();
  }
}}
/>

        <button className="send-btn" onClick={sendMessage}>
  {editingIndex !== null
 ? "✔"
: "➤"}
</button>
      </div>
    </div>
  );
}

export default Chat;