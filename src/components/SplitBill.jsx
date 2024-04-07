import "./splitBillStyles.css";

import { useState } from "react";

const initialFriends = [
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function addCloseBtn() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    addCloseBtn();
  }
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="principal">
      <h1>Split Bills</h1>
      <div className="app">
        <div className="sidebar">
          <Button onClickBtn={addCloseBtn}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          <FriendsList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />
        </div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((fr) => (
        <Friend
          key={fr.id}
          friend={fr}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">I owe ${Math.abs(friend.balance)}</p>
      )}
      {friend.balance > 0 && (
        <p className="green">owes you ${Math.abs(friend.balance)}</p>
      )}
      {friend.balance === 0 && <p>and you are even</p>}
      <Button onClickBtn={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClickBtn }) {
  return (
    <button className="button" onClick={onClickBtn}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😄 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userShare, setUserShare] = useState("");
  //Derived State
  const friendShare = bill ? bill - userShare : "";
  const [whoPays, setWhoPays] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userShare) return;
    onSplitBill(whoPays === "user" ? friendShare : -userShare);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill Value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>💵Your expense</label>
      <input
        type="text"
        value={userShare}
        onChange={(e) =>
          setUserShare(
            Number(e.target.value) > bill ? userShare : Number(e.target.value)
          )
        }
      />

      <label>👫{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendShare} />

      <label>🫰Who's paying the bill?</label>

      <div>
        <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
        <Button>Split bill</Button>
      </div>
    </form>
  );
}
