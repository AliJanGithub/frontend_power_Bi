import React, { useState, useRef, useEffect } from 'react';
import { useData } from './DataContext';
import { Button } from './ui/button';
import { User, AtSign } from './icons/Icons';
import { useAuth } from './AuthContext';



export function UserMention({ 
  value, 
  onChange, 
  placeholder = "Write a comment...", 
  className = "",
  rows = 3 
}) {
  const { getAllUsers } = useData();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionTrigger, setMentionTrigger] = useState(null);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);
const {userRoleUser}=useAuth()
  const users =userRoleUser

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target )) {
        setShowSuggestions(false);
        setMentionTrigger(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    // Check for @ mentions
    const beforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const mentionStart = cursorPosition - mentionMatch[0].length;
      const mentionQuery = mentionMatch[1];
      
      setMentionTrigger({
        start: mentionStart,
        query: mentionQuery
      });
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setMentionTrigger(null);
    }

    // Extract tagged user IDs from the current text
    const mentions = newValue.match(/@(\w+)/g) || [];
    const currentTaggedUsers = mentions
      .map(mention => {
        const username = mention.substring(1);
        const user = users.find(u => u.name.toLowerCase().replace(' ', '') === username.toLowerCase());
        return user?.id;
      })
      .filter(Boolean) ;

    setTaggedUsers(currentTaggedUsers);
    onChange(newValue, currentTaggedUsers);
  };

  const handleUserSelect = (user) => {
    if (!mentionTrigger || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const before = value.substring(0, mentionTrigger.start);
    const after = value.substring(textarea.selectionStart);
    const username = user.name.toLowerCase().replace(' ', '');
    const newValue = `${before}@${username} ${after}`;

    const newTaggedUsers = [...taggedUsers];
    if (!newTaggedUsers.includes(user.id)) {
      newTaggedUsers.push(user.id);
    }

    setTaggedUsers(newTaggedUsers);
    onChange(newValue, newTaggedUsers);
    setShowSuggestions(false);
    setMentionTrigger(null);

    // Focus back to textarea and position cursor
    setTimeout(() => {
      const newCursorPosition = mentionTrigger.start + username.length + 2;
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const filteredUsers = mentionTrigger
    ? users.filter(user =>
        user.name.toLowerCase().includes(mentionTrigger.query.toLowerCase()) ||
        user.email.toLowerCase().includes(mentionTrigger.query.toLowerCase())
      )
    : [];

  const getSuggestionPosition = () => {
    if (!textareaRef.current || !mentionTrigger) return { top: 0, left: 0 };

    const textarea = textareaRef.current;
    const rect = textarea.getBoundingClientRect();
    
    // Simple positioning - in a real app you'd want more sophisticated positioning
    return {
      top: rect.bottom + 5,
      left: rect.left
    };
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${className}`}
      />

      {/* Tagged Users Display */}
      {taggedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {taggedUsers.map(userId => {
            const user = users.find(u => u.id === userId);
            if (!user) return null;
            return (
              <div
                key={userId}
                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                <AtSign className="h-3 w-3 mr-1" />
                {user.name}
              </div>
            );
          })}
        </div>
      )}

      {/* User Suggestions Dropdown */}
      {showSuggestions && mentionTrigger && filteredUsers.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
          style={getSuggestionPosition()}
        >
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <AtSign className="h-3 w-3 mr-1" />
              Mention someone
            </div>
            {filteredUsers.map(user => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start text-left p-2 h-auto"
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}