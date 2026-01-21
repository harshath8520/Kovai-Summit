# KOVAI SUMMIT Dashboard - Testing Checklist

## CRITICAL FIX APPLIED
✅ Fixed broken Firebase import URL (typo: "g static.com" → "gstatic.com")

---

## Testing Instructions

### 1. INITIAL LOAD TEST
Open `index.html` in your browser and verify:
- [ ] Page loads without console errors
- [ ] Sidebar appears on the left with logo "KOVAI SUMMIT"
- [ ] Countdown timer shows at the top (Days, Hours, Minutes, Seconds)
- [ ] 4 metric cards display: Stalls (17/60), Tickets (4/500), Sponsorships (0/10), Reels (0/50)
- [ ] Numbers update from Firebase default state

**Expected Result**: Dashboard loads with glassmorphism design, purple/magenta gradients

---

### 2. COUNTDOWN TIMER TEST
Watch the timer for 5 seconds:
- [ ] Seconds counter updates every second
- [ ] Timer shows correct format (e.g., "10 Days")
- [ ] Numbers are large and readable

**Expected Result**: Live countdown with smooth second-by-second updates

---

### 3. NAVIGATION TEST
Click each sidebar link:
- [ ] Click "Overview" → Shows metric cards and countdown
- [ ] Click "Sponsorships" → Shows sponsor table (empty initially)
- [ ] Click "Team & KPIs" → Shows 6 team member cards
- [ ] Click "Admin Settings" → Shows admin control panel

**Expected Result**: Views switch smoothly, active link highlights in purple

---

### 4. SPONSORSHIP TEST
In "Sponsorships" section:
- [ ] Click "+ NEW LEAD" button
- [ ] Form appears with Company Name, Tier, Value, Owner fields
- [ ] Fill form: Name="Test Corp", Tier="Gold", Value="50000", Owner="Surya"
- [ ] Click "ADD"
- [ ] New row appears in table
- [ ] Click "×" button to delete → Confirms and removes

**Expected Result**: Sponsor adds/deletes, sponsorship count updates in Overview

---

### 5. TEAM PERFORMANCE TEST
In "Team & KPIs" section:
- [ ] 6 team cards display:
  • Darshan (30%, On Track)
  • Gokul (20%, Behind)
  • Surya (45%, On Track)
  • Samuel Gurudas (10%, Critical)
  • Kamal (60%, On Track)
  • Ajit (15%, Delay)
- [ ] Progress bars show correct percentages
- [ ] Status badges display correct colors (purple=track, pink=critical)

**Expected Result**: Team cards with avatars, tasks, and progress bars

---

### 6. ADMIN CENTER TEST
In "Admin Settings":
- [ ] 4 control boxes display: Stalls, Tickets, Sponsorships, Reels
- [ ] Each has "Target" and "Sold" input fields
- [ ] Change "Sold Stalls" from 17 to 25
- [ ] Scroll down to "Team Performance KPIs"
- [ ] Drag Darshan's slider from 30% to 50%
- [ ] Change Gokul's status dropdown to "On Track"
- [ ] Click "UPDATE SYSTEM" button
- [ ] Alert shows: "Real-time sync initiated across all devices"
- [ ] Go back to Overview → verify "Sold Stalls" now shows 25

**Expected Result**: All changes save and sync via Firebase

---

### 7. MOBILE RESPONSIVE TEST
Resize browser to 800px width or open on phone:
- [ ] Hamburger menu (☰) appears in top-left corner
- [ ] Sidebar is hidden
- [ ] Click hamburger → sidebar slides in from left
- [ ] Click any link → view changes AND sidebar auto-closes
- [ ] Click "X" button → sidebar closes
- [ ] Countdown timer scales down to fit screen
- [ ] Metric cards stack vertically

**Expected Result**: Drawer navigation works smoothly, no horizontal scroll

---

### 8. FIREBASE REAL-TIME TEST
Open dashboard in TWO browser windows/tabs:
- [ ] Window 1: Change "Sold Tickets" to 10, click UPDATE SYSTEM
- [ ] Window 2: Verify "Sold Tickets" automatically updates to 10 (without refresh)
- [ ] Window 2: Add a sponsor lead
- [ ] Window 1: Verify new sponsor appears in table (without refresh)

**Expected Result**: Changes appear instantly in all open windows

---

### 9. CONSOLE ERROR CHECK
Open browser DevTools (F12) → Console tab:
- [ ] No red errors on page load
- [ ] No errors when switching views
- [ ] No errors when adding/deleting sponsors
- [ ] Firebase connection successful message (if any)

**Expected Result**: Clean console with no errors

---

### 10. VISUAL DESIGN CHECK
Verify premium aesthetic:
- [ ] Deep purple/blue background with gradient orbs
- [ ] Glassmorphism cards with blur effect
- [ ] Purple-to-pink gradient on buttons
- [ ] Smooth hover animations on cards
- [ ] Purple progress bars with glow effect
- [ ] Poppins font throughout

**Expected Result**: Professional, modern dashboard design

---

## KNOWN ITEMS TO VERIFY

### CSS Classes Working:
- `.metric-card` - glassmorphism cards
- `.metric-value` - large numbers on cards
- `.progress-fill` - purple gradient progress bars
- `.badge-status` - status badges
- `.btn-premium` - gradient buttons with shine effect
- `.hero-counter-grid` - countdown timer layout

### JavaScript Functions Working:
- `toggleSidebar()` - mobile menu
- `switchView()` - navigation
- `updateCountdown()` - timer
- `addSponsor()` - add sponsor
- `deleteSponsor()` - remove sponsor
- `updateTeamEfficiency()` - slider updates
- `updateNumbers()` - save admin changes

---

## TROUBLESHOOTING

### If Nothing Loads:
1. Open Console (F12) - check for errors
2. Verify Firebase config is in `dashboard.js` lines 6-13
3. Check if `type="module"` is in script tag at bottom of `index.html`

### If Sidebar Doesn't Show on Desktop:
1. Check browser width is > 1024px
2. Verify `kovai-summit.css` loaded (check Network tab)

### If Firebase Doesn't Sync:
1. Verify Firestore database exists in Firebase Console
2. Check Firestore Security Rules allow read/write
3. Confirm config credentials are correct

---

## SUCCESS CRITERIA

✅ **ALL 10 TESTS PASS** = Dashboard is production-ready for Vercel

If any test fails, report:
1. Which test number failed
2. What you see vs. what you expected
3. Any console errors (copy exact error message)

---

**Test conducted by**: ___________
**Date**: ___________
**Result**: ☐ PASS  ☐ FAIL (see notes)
**Notes**: 
