import Phaser from 'phaser'

import CratePool, { KEY_CRATE } from './cratePool'

const INFO_FORMAT = 
`Size:       %1
Spawned:    %2
Despawned:  %3`

export default class CratesScene extends Phaser.Scene
{
	private group?: CratePool
	private infoText?: Phaser.GameObjects.Text

	constructor()
	{
        const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
            classType: Phaser.GameObjects.Image,
            maxSize: -1
        }
		super('crates-scene-basic')
        
	}

	preload()
	{
		this.load.image(KEY_CRATE, 'assets/crate_01.png')
	}

	create()
	{
        this.group = this.add.cratePool()
        this.group?.initializeWithSize(5)

		/* this.group = this.add.group({
			defaultKey: KEY_CRATE
		}) */

		this.infoText = this.add.text(16, 16, '')

        this.input.on(Phaser.Input.Events.POINTER_DOWN, pointer => {
            this.spawnCrate(pointer.x, pointer.y)
        })
	}

	update()
	{
		if (!this.group || !this.infoText)
		{
			return
		}

		const size = this.group.getLength()
		const used = this.group.getTotalUsed()
		const text = Phaser.Utils.String.Format(
			INFO_FORMAT,
			[
				size,
				used,
				size - used
			]
		)

		this.infoText.setText(text)
	}

	private spawnCrate(x = 400, y = 300)
	{
        if (!this.group)
        {
            return null
        }

        const crate = this.group.spawn(x, y)
        
        crate.alpha = 1
        crate.scale = 1
        crate.setVisible(true)
        crate.setActive(true)

        this.tweens.add({
            targets: crate,
            scale: 2,
            alpha: 0,
            duration: Phaser.Math.Between(500, 1500),
            onComplete: (tween) => {
                this.group?.despawn(crate)
                this.tweens.killTweensOf(crate)
            }
        })

        return crate
    }
}