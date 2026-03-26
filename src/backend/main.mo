import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";

actor {
  // Types
  type ContactCategory = { #personal; #professional; #natural; #other };

  type Contact = {
    id : Nat;
    name : Text;
    category : ContactCategory;
    owner : Principal;
  };

  type MeetingNote = {
    id : Nat;
    contactId : Nat;
    date : Text;
    summary : Text;
  };

  module MeetingNote {
    public func compareByDateDesc(note1 : MeetingNote, note2 : MeetingNote) : Order.Order {
      switch (Text.compare(note2.date, note1.date)) {
        case (#equal) { Nat.compare(note1.id, note2.id) };
        case (order) { order };
      };
    };
  };

  // State
  let users = Map.empty<Text, Principal>();
  let contacts = Map.empty<Nat, Contact>();
  let meetingNotes = Map.empty<Nat, MeetingNote>();

  var nextContactId = 1;
  var nextNoteId = 1;

  // Public functions
  public shared ({ caller }) func login(name : Text) : async () {
    if (users.containsKey(name)) { Runtime.trap("Name already taken") };
    users.add(name, caller);
  };

  public shared ({ caller }) func createContact(name : Text, category : ContactCategory) : async Nat {
    let id = nextContactId;
    nextContactId += 1;

    let contact : Contact = {
      id;
      name;
      category;
      owner = caller;
    };

    contacts.add(id, contact);
    id;
  };

  public shared ({ caller }) func createMeetingNote(contactId : Nat, date : Text, summary : Text) : async Nat {
    if (not contacts.containsKey(contactId)) { Runtime.trap("Contact does not exist") };

    let id = nextNoteId;
    nextNoteId += 1;

    let note : MeetingNote = {
      id;
      contactId;
      date;
      summary;
    };

    meetingNotes.add(id, note);
    id;
  };

  public shared ({ caller }) func updateMeetingNote(id : Nat, summary : Text) : async () {
    switch (meetingNotes.get(id)) {
      case (null) { Runtime.trap("Meeting note does not exist") };
      case (?note) {
        let updatedNote = {
          id = note.id;
          contactId = note.contactId;
          date = note.date;
          summary;
        };
        meetingNotes.add(id, updatedNote);
      };
    };
  };

  public query func getContactsByUser(owner : Principal) : async [Contact] {
    contacts.values().toArray().filter(func(c) { c.owner == owner });
  };

  public query func getContactsByUserAndCategory(owner : Principal, category : ContactCategory) : async [Contact] {
    contacts.values().toArray().filter(
      func(c) { c.owner == owner and c.category == category }
    );
  };

  public query func getMeetingNotesByContact(contactId : Nat) : async [MeetingNote] {
    let filtered = meetingNotes.values().toArray().filter(
      func(note) { note.contactId == contactId }
    );
    filtered.sort(
      MeetingNote.compareByDateDesc
    );
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func summarizeText(text : Text) : async Text {
    let apiUrl = "https://api.gpting.app/v1/summarize";
    await OutCall.httpPostRequest(apiUrl, [], text, transform);
  };
};
