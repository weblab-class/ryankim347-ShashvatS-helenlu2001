import pyperclip
# leftX and leftY are coordinates of upper left corner of this horizontal line, length is how many 40x40 blocks there are
def makeHorizLine(x,y,leftX,leftY,length):
  for i in range(length):
    x.append(leftX+40*i)
    y.append(leftY)

# leftX and leftY are coordinates of upper left corner of this vertical line, length is how many 40x40 blocks there are
def makeVertLine(x,y,leftX,leftY,length):
  for i in range(length):
    x.append(leftX)
    y.append(leftY+40*i)

x = []
y = []

makeHorizLine(x,y,-300,-300,30)
makeVertLine(x,y,900,-300,30)
makeHorizLine(x,y,-300,900,31)
makeVertLine(x,y,-300,-300,30)

makeVertLine(x,y,200,200,5)
makeVertLine(x,y,400,200,5)
makeHorizLine(x,y,200,400,6)


makeVertLine(x,y,-100,-200,8)

makeHorizLine(x,y,420,-100,8)

makeHorizLine(x,y,-100,600,12)

makeVertLine(x,y,700,700,5)
makeHorizLine(x,y,700,700,3)
mapString = ''
mapString += '{\n'
mapString += '\t\t"x": ' + str(x) + ',\n'
mapString += '\t\t"y": ' + str(y) + ',\n'
mapString += '\t\t"id": ' + str(200) + ',\n'
mapString += '\t\t"__v": ' + str(0) + '\n'
mapString += '}'
print(mapString)
pyperclip.copy(mapString)
