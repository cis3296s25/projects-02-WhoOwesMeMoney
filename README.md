# Who Owes Me Money
The purpose of this app is to track how much someone owes you. Why can’t you just use a sheet of paper or your notes app on your phone, you ask?
This app is different from just pen and paper in that it can scan the receipt and pick out the item and their totals and assign them to the people that had them.
For example me and two friends go out, they order a steak, a hamburger, and a soup.
I can assign my friends the item they had and it will give me the total the owe plus tip and tax! This will work even if they had multiple items and the nice part is that you can keep a running tab of the total they owe you so you never forget.

![This is a screenshot.](images.png)
# How to run
Follow instructions at https://nodejs.org/en/download/ to make sure your computer has Node.js V23.10.0 with npm package manager. Then, clone the project to desired folder. In terminal, navigate to "/whoowesmemoney" within the folder.

Install Android Studio Emulator and newest version of Android(Current: Android 15)

Then open Android Emulator

Install dependencies:
npx install

Run:
npx expo start

# To Build
1. npm install -g eas-cli
2. eas build:configure
    -Choose Android

If asked for login ask Billy for account info

3. eas build -p android --profile preview

Will output a .apk you can download and transfer to any android device or test immediately on emulator



# How to contribute
Follow this project board to know the latest status of the project: [https://github.com/orgs/cis3296s25/projects/63]([https://github.com/orgs/cis3296s25/projects/63])


