import pyperclip
# leftX and leftY are coordinates of upper left corner of this horizontal line, length is how many 40x40 blocks there are
def makeHorizLine(x,y,leftX,leftY,length):
  for i in range(length):
    x.append(leftX+i)
    y.append(leftY)

# leftX and leftY are coordinates of upper left corner of this vertical line, length is how many 40x40 blocks there are
def makeVertLine(x,y,leftX,leftY,length):
  for i in range(length):
    x.append(leftX)
    y.append(leftY+i)

x = []
y = []

makeHorizLine(x,y,0,0,31)
makeVertLine(x,y,0,0,31)
makeHorizLine(x,y,0,30,31)
makeVertLine(x,y,30,0,31)
mapString = ''
mapString += '{\n'
mapString += '\t\t"x": ' + str(x) + ',\n'
mapString += '\t\t"y": ' + str(y) + ',\n'
mapString += '\t\t"id": ' + str(200) + ',\n'
mapString += '\t\t"__v": ' + str(0) + '\n'
mapString += '}'
print(mapString)
pyperclip.copy(mapString)
