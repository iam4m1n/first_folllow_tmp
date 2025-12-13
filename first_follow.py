def get_first(grammer: dict[str, list[str]]) -> dict[str, set]:
    first = {v: set() for v in grammer}
    changed = True
    while changed:
        changed = False
        for A, prods in grammer.items():
            for prod in prods:
                symbols = prod.split()
                if symbols == ['ε']:
                    if 'ε' not in first[A]:
                        first[A].add('ε'); changed = True
                    continue
                
                nullable_prefix = True
                for X in symbols:
                    if X in grammer:
                        befor = len(first[A])
                        first[A].update(first[X] - {'ε'})
                        if len(first[A]) > befor:
                            changed = True
                        if 'ε' not in first[X]:
                            nullable_prefix = False
                            break
                    else:
                        if X not in first[A]:
                            first[A].add(X); changed = True
                        nullable_prefix = False
                        break
                
                if nullable_prefix:
                    if 'ε' not in first[A]:
                        first[A].add('ε'); changed = True

    return first



def get_follow(grammer: dict[str, list[str]], first: dict[str, set] = None) -> dict[str, set]:
    follow = {v: set() for v in grammer}
    follow[list(grammer.keys())[0]].add('$')
    changed = True
    while changed:
        changed = False
        for A, prods in grammer.items():
            for prod in prods:
                symbols = prod.split()
                trailer = follow[A].copy()
                for i in range(len(symbols)-1, -1, -1):
                    X = symbols[i]
                    if X in grammer:
                        befor = len(follow[X])
                        follow[X].update(trailer)
                        if len(follow[X]) > befor:
                            changed = True
                        if 'ε' in first[X]:
                            trailer.update(first[X] - {'ε'})
                        else:
                            trailer = first[X].copy()
                    else:
                        trailer = {X}
    return follow


grammer = {
    'S': ["A B C", "D E"],
    'A': ["a A", "ε"],
    'B': ["b B", "c", "ε"],
    'C': ["a C d", "b C", "ε"],
    'D': ["d D", "F G"],
    'E': ["e E", "ε"],
    'F': ["f F", "ε"],
    'G': ["g", "ε"]
}

# grammer = {
#     'S': ["A B C D"],
#     'A': ["a", "ε"],
#     'B': ["b", "ε"],
#     'C': ["c", "ε"],
#     'D': ["d", "ε"]
# }

first = get_first(grammer)
for A, firsts in first.items():
    print("FIRST(" + A, end=") = ")
    print(sorted(firsts))


follow = get_follow(grammer, first)
for A, follows in follow.items():
    print("FOLLOW(" + A, end=") = ")
    print(sorted(follows))